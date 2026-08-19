import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';

// Authentication is intentionally out of scope (single-user assumption per
// the assessment brief). This endpoint exists purely so the frontend can
// populate an "assignee" dropdown from real data instead of hardcoding names.
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }
}
