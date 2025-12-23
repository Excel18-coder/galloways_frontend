import { IsNotEmpty, IsNumber,IsString,  }     from "class-validator";


export class CreateBasedConsultationDto {
    @IsString()
    @IsNotEmpty()
    full_name: string;
    @IsString()
    @IsNotEmpty()
    email: string
    @IsNumber()
    @IsNotEmpty()
    phone: number;
    @IsNotEmpty()
    @IsString()
    project_description: string;
    @IsString()
    @IsNotEmpty()
    estimated_duration: string;
}
