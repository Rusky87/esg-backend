import { Controller, Get, NotFoundException, Param, ParseIntPipe } from '@nestjs/common';
import { CompaniesService } from './companies.service';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  getCompanies() {
    return this.companiesService.getCompanies();
  }

  @Get(':id')
  getCompanyById(@Param('id', ParseIntPipe) id: number) {
    const company = this.companiesService.getCompanyById(id);

    if (!company) {
      throw new NotFoundException('Società non trovata');
    }

    return company;
  }
}