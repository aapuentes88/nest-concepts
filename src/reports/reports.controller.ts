import { Body, Controller, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AdminGuard } from 'src/guards/admin.guard ';
import { AuthGuard } from 'src/guards/auth.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { ApproveReportDto } from './dto/approve.report.dto';
import { CreateReportDto } from './dto/create-report.dto';
import { ReportDto } from './dto/report.dto';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {

  constructor(private reportService: ReportsService){}

  @Post('new')
  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  createReport(@Body() body: CreateReportDto, @CurrentUser() user){
    return this.reportService.create(body, user)
  }

  @Patch(':id')
  // @UseGuards(AdminGuard)
  approveReport(@Param('id') id: string, @Body() body: ApproveReportDto){
    console.log('id: ', id, '  body.approved', body.approved)
    return this.reportService.changeApproval(+id, body.approved);
  }
}
