import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactService {
  constructor(private prisma: PrismaService) { }

  async create(createContactDto: CreateContactDto) {
    return this.prisma.prisma.contactMessage.create({
      data: createContactDto,
    });
  }

  async findAll() {
    return this.prisma.prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(id: string) {
    return this.prisma.prisma.contactMessage.update({
      where: { id },
      data: { isRead: true },
    });
  }

  async delete(id: string) {
    return this.prisma.prisma.contactMessage.delete({
      where: { id },
    });
  }
}
