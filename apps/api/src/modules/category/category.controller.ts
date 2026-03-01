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
    return this.categoryService.create(req.user.id, createCategoryDto);
  }

  // GET /category?auctionId=...
  @Get()
  findAll(@Query("auctionId") auctionId: string) {
    return this.categoryService.findAllByAuction(auctionId);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() UpdateCategoryDto: UpdateCategoryDto,
    @Request() req: any
  ) {
    // Pass user ID to ensure they own the auction they are editing!
    return this.categoryService.update(id, req.user.id, UpdateCategoryDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string, @Request() req: any) {
    return this.categoryService.remove(id, req.user.id);
  }
}
