import { CreateReportDto } from './dtos/create-report.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './report.entity';
import { User } from 'src/users/user.entity';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  /**
   * Create a new report and save it to the database
   * @param reportDto DTO to use for the report
   * @param user User associated with the report (user creating the report)
   */
  create(reportDto: CreateReportDto, user: User) {
    const report = this.repo.create(reportDto);

    // Add association of user to the report
    report.user = user;

    return this.repo.save(report);
  }

  async changeApproval(id: string, approved: boolean) {
    const report = await this.repo.findOne({ where: { id: parseInt(id) } });

    // TODO: Add error handling
  }
}
