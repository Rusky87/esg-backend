import { Injectable } from '@nestjs/common';

@Injectable()
export class CompaniesService {
  private companies: any[] = [];

  setCompanies(companies: any[]) {
    this.companies = companies;
  }

  getCompanies() {
    return this.companies;
  }
}