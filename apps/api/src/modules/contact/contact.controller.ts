import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  // Public endpoint for users to submit contact forms
  @Post()
  create(@Body() createContactDto: CreateContactDto) {
    return this.contactService.create(createContactDto);
  }

  // Admin endpoints to view and manage messages
  @UseGuards(AuthGuard('firebase-jwt'), RolesGuard)
  @Get()
  findAll() {
    return this.contactService.findAll();
  }

  @UseGuards(AuthGuard('firebase-jwt'), RolesGuard)
  @Patch(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.contactService.markAsRead(id);
  }

  @UseGuards(AuthGuard('firebase-jwt'), RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contactService.delete(id);
  }
}
