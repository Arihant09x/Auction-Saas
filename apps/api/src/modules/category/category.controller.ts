import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  Patch,
} from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { AuthGuard } from "@nestjs/passport";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@Controller("category")
@UseGuards(AuthGuard("firebase-jwt"))
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  create(@Request() req: any, @Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(req.user.id, req.user.role, createCategoryDto);
  }

  // GET /category?auctionId=...
  @Get()
  findAll(@Query("auctionId") auctionId: string, @Request() req: any) {
    return this.categoryService.findAllByAuction(auctionId, req.user.id, req.user.role);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Request() req: any
  ) {
    return this.categoryService.update(id, req.user.id, req.user.role, updateCategoryDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string, @Request() req: any) {
    return this.categoryService.remove(id, req.user.id, req.user.role);
  }
}
