import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from '../prisma.service';
import { StationDataDto } from 'src/dto/station-data.dto';
import { Cron, Interval } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';


const configService = new ConfigService();
const AQ_API = axios.create({ baseURL: configService.get<string>('AQ_API') });
const STATION_1_NAME: string = configService.get<string>('STATION_1_NAME');
const STATION_1_ID: number = Number.parseInt(
  configService.get<string>('STATION_1_ID'),
);
const STATION_2_NAME: string = configService.get<string>('STATION_2_NAME');
const STATION_2_ID: number = Number.parseInt(
  configService.get<string>('STATION_2_ID'),
);

@Injectable()
export class AqService implements OnApplicationBootstrap {
  constructor(private readonly prisma: PrismaService) {}

  private readonly logger = new Logger(AqService.name);

  /**
   * Exécute les tâches automatisées une fois au lancement de l'appli avant les rappels périodiques
   */
  async onApplicationBootstrap() {
    await this.handleInitialTask();
  }

  /**
   * Récupérer les dernières données des stations afin de servire l'app cliente
   *
   * @returns Tableau contenant les dernières enregistrements des deux stations
   */
  async getCurrentStationData() {
    const latestStationsData = await this.prisma.stationData.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 2,
    });

    return {
      currentStation1: latestStationsData[0],
      currentStation2: latestStationsData[1],
    };
  }

  /**
   *
   * @returns Tableau contenant les valeurs moyennes enregistrées par heure par les capteurs
   */
  async getStationHourlyAvg() {
    const hourlyDataStation1 = await this.prisma.stationHourlyAvg.findMany({
      where: {
        station_name: STATION_1_NAME,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const hourlyDataStation2 = await this.prisma.stationHourlyAvg.findMany({
      where: {
        station_name: STATION_2_NAME,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return { hourlyDataStation1, hourlyDataStation2 };
  }

  /**
   * Récupère et enregistre dans la base les dernières données collectées par les capteurs
   */
  private async setCurrentsValues() {
    try {
      // Récupération des données pour les stations depuis l'API
      const station1 = await AQ_API.get(`/getCurrentValues/SMART188`);
      const station2 = await AQ_API.get(`/getCurrentValues/SMART189`);

      let partialStation1Data: StationDataDto = new StationDataDto();
      let partialStation2Data: StationDataDto = new StationDataDto();

      // Je map les valeurs pour les station 1 & 2
      station1.data.values.map((v) => {
        partialStation1Data[v.sensor] = v.value;
      });
      station2.data.values.map((v) => {
        partialStation2Data[v.sensor] = v.value;
      });

      // Constitution des objets de données pour les deux stations
      const station1Data = {
        station_name: station1.data.station_name,
        timestamp: station1.data.timestamp,
        ...partialStation1Data,
      };
      const station2Data = {
        station_name: station2.data.station_name,
        timestamp: station2.data.timestamp,
        ...partialStation2Data,
      };

      // Vérification si les données existent déjà pour les station 1 & 2
      const existedValueS1 = await this.prisma.stationData.findFirst({
        where: {
          ...station1Data,
        },
      });
      const existedValueS2 = await this.prisma.stationData.findFirst({
        where: {
          ...station2Data,
        },
      });

      // Insertion des nouvelles données si nécessaire
      const dataToInsert = [];
      if (!existedValueS1) {
        dataToInsert.push(station1Data);
      }
      if (!existedValueS2) {
        dataToInsert.push(station2Data);
      }

      if (dataToInsert.length > 0) {
        await this.prisma.stationData.createManyAndReturn({
          data: dataToInsert,
        });
        // this.logger.log('Enregistrement effectué.');
      } else {
        this.logger.log('Ces données existent déjà dans la base.');
      }
    } catch (err) {
      this.logger.error(err.message);
      throw new Error(
        "Erreur lors de la récupération et de l'insertion des données des stations.",
      );
    }
  }

  /**
   * Récupère et enregistre de façon horaire les dernières données collectées  par les capteurs
   */
  private async setStationsHourlyAvg() {
    const lastS1HourlyAvg = await this.getLastStationHourlyAvg({
      station_id: STATION_1_ID,
    });
    const lastS2HourlyAvg = await this.getLastStationHourlyAvg({
      station_id: STATION_2_ID,
    });

    try {
      // Vérification pour la station 1
      const existedValueS1 = await this.prisma.stationHourlyAvg.findFirst({
        where: {
          station_name: STATION_1_NAME,
          timestamp: lastS1HourlyAvg.timestamp,
        },
      });

      // Vérification pour la station 2
      const existedValueS2 = await this.prisma.stationHourlyAvg.findFirst({
        where: {
          station_name: STATION_2_NAME,
          timestamp: lastS2HourlyAvg.timestamp,
        },
      });

      // Si les données n'existent pas encore, on les insère
      if (!existedValueS1 || !existedValueS2) {
        const dataToInsert = [];

        if (!existedValueS1) {
          dataToInsert.push(lastS1HourlyAvg);
        }
        if (!existedValueS2) {
          dataToInsert.push(lastS2HourlyAvg);
        }

        if (dataToInsert.length > 0) {
          const lastStationsHourlyAvg =
            await this.prisma.stationHourlyAvg.createManyAndReturn({
              data: dataToInsert,
            });

          return lastStationsHourlyAvg;
        }

        return 'Les données existent déjà pour les deux stations.';
      } else {
        return 'Les données existent déjà pour les deux stations.';
      }
    } catch (err) {
      this.logger.error(err.message);
      throw new Error("Erreur lors de l'enregistrement des données.");
    }
  }

  /**
   * Tâche automatisée pour la récupération des données moyennes 2 min après chaque heure
   */
  @Cron('2 * * * *')
  private async handleHourlyTask() {
    this.logger.debug('Auto-exécution [horaire]', new Date().toISOString());
    await this.setStationsHourlyAvg();
  }

  /**
   * Tâche automatisée s'exécutant dans un interval infini de 3min pour les données en temps réel
   */
  @Interval(180000)
  private async handleIntervalTask() {
    this.logger.debug('Auto-exécution [3min]', new Date().toISOString());
    await this.setCurrentsValues();
  }

  /**
   *
   * @param station_id l'identifiant de la station dont on veut récupérer le dernier enregistrement
   *
   * @returns Promise<StationDataDto>
   */
  private async getLastStationHourlyAvg({
    station_id,
  }: {
    station_id: number;
  }): Promise<StationDataDto> {
    const response = await AQ_API.get(`/v3/getStationHourlyAvg/${station_id}`);
    const lastHourlyAvg = response.data.data.slice(-1)[0];
    const lastStationHourlyAvg: StationDataDto = {
      station_name: response.data.header.station_name,
      extT: lastHourlyAvg.T,
      co: lastHourlyAvg.CO,
      no2: lastHourlyAvg.NO2,
      o3: lastHourlyAvg.O3,
      pm10: lastHourlyAvg.PM10,
      pm25: lastHourlyAvg['PM2.5'],
      rh: lastHourlyAvg.RH,
      timestamp: lastHourlyAvg.timestamp,
    };
    return lastStationHourlyAvg;
  }

  private async handleInitialTask() {
    this.handleIntervalTask();
    this.handleHourlyTask();
  }
}
