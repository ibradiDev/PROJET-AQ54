import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class StationDataDto {
  @IsNotEmpty()
  @IsString()
  station_name: string;

  @IsNotEmpty()
  @IsString()
  @IsDateString()
  timestamp: string;

  @IsNumber()
  @IsNotEmpty()
  extT: number;

  @IsNumber()
  @IsNotEmpty()
  rh: number;

  @IsNumber()
  @IsNotEmpty()
  o3: number;

  @IsNumber()
  @IsNotEmpty()
  co: number;

  @IsNumber()
  @IsNotEmpty()
  no2: number;

  @IsNumber()
  @IsNotEmpty()
  pm25: number;

  @IsNumber()
  @IsNotEmpty()
  pm10: number;
}
