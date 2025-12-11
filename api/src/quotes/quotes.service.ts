import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { UpdateQuoteDto } from './dto/update-quote.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quote } from './entities/quote.entity';

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

@Injectable()
export class QuotesService {
  constructor(
    @InjectRepository(Quote)
    private readonly quoteRepository: Repository<Quote>,
  ) { }

  private generateReference(product: string): string {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');

    // Use product type to create prefix (Motor -> MOT)
    const prefix = product
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 3);

    return `${prefix}${year}${month}${day}${random}`;
  }

  private processDateField(value: string | Date | undefined): Date | undefined {
    if (!value) return undefined;
    const date = new Date(value);
    return isNaN(date.getTime()) ? undefined : date;
  }

  private processNumberField(
    value: string | number | undefined,
  ): number | undefined {
    if (value === undefined || value === '') return undefined;
    const num = Number(value);
    return isNaN(num) ? undefined : num;
  }

  async create(createQuoteDto: CreateQuoteDto): Promise<ApiResponse<Quote>> {
    try {
      const processedData = { ...createQuoteDto };

      // Process timestamp if provided, otherwise use current timestamp
      const timestamp = processedData.timestamp
        ? this.processDateField(processedData.timestamp)
        : new Date();

      // Create the entity object
      const prepared: Partial<Quote> = {
        firstName: processedData.firstName,
        lastName: processedData.lastName,
        email: processedData.email,
        phone: processedData.phone,
        location: processedData.location,
        product: processedData.product,
        selectedProduct: processedData.selectedProduct,

        budget: processedData.budget,
        coverage: processedData.coverage,
        details: processedData.details,
        contactMethod: processedData.contactMethod,
        bestTime: processedData.bestTime,
        documents: JSON.stringify(processedData.documents),
        terms: processedData.terms,
        status: processedData.status || 'SUBMITTED',
        timestamp: timestamp || new Date(),
      };

      const newQuote = this.quoteRepository.create(prepared);
      const saved = await this.quoteRepository.save(newQuote);

      return {
        success: true,
        message: 'Quote created successfully',
        data: saved,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to create quote',
        error: error.message,
      };
    }
  }
  async findAll(): Promise<ApiResponse<(Omit<Quote, "documents"> & { documents: any[] })[]>> {
    try {
      const quotes = await this.quoteRepository.find()
      const processedQuotes = quotes.map((quote) => {
        let parsedDocuments: any[] = [];
        if (quote.documents) {
          try {
            parsedDocuments = JSON.parse(quote.documents) as unknown as any[];
          } catch (parseError) {
            console.warn(`Failed to parse documents for quote ${quote.id}:`, parseError.message);
            parsedDocuments = [];
          }
        }

        return {
          ...quote,
          documents: parsedDocuments
        };
      });

      return {
        success: true,
        message: 'Quotes retrieved successfully',
        data: processedQuotes,
      };

    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve quotes',
        error: error.message,
      };
    }
  }
  async findOne(id: number): Promise<ApiResponse<Quote>> {
    try {
      const quote = await this.quoteRepository.findOne({ where: { id } });
      if (!quote) throw new NotFoundException(`Quote with id ${id} not found`);
      return {
        success: true,
        message: 'Quote found successfully',
        data: { ...quote, documents: quote.documents ? JSON.parse(quote.documents) : [] }
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      return {
        success: false,
        message: `Failed to find quote with id ${id}`,
        error: error.message,
      };
    }
  }

  async update(
    id: number,
    updateQuoteDto: UpdateQuoteDto,
  ): Promise<ApiResponse<Quote>> {
    try {
      // Check if quote exists
      const quote = await this.quoteRepository.findOne({ where: { id } });
      if (!quote) {
        throw new NotFoundException(`Quote with id ${id} not found`);
      }

      // Process the update data
      const processedData = { ...updateQuoteDto };

      // Create the update object
      const prepared: Partial<Quote> = {};

      // Map all the fields that might be updated
      if (processedData.firstName !== undefined)
        prepared.firstName = processedData.firstName;
      if (processedData.lastName !== undefined)
        prepared.lastName = processedData.lastName;
      if (processedData.email !== undefined)
        prepared.email = processedData.email;
      if (processedData.phone !== undefined)
        prepared.phone = processedData.phone;
      if (processedData.location !== undefined)
        prepared.location = processedData.location;
      if (processedData.product !== undefined)
        prepared.product = processedData.product;
      if (processedData.selectedProduct !== undefined)
        prepared.selectedProduct = processedData.selectedProduct;
      // if (processedData.vehicleType !== undefined) prepared.vehicleType = processedData.vehicleType;
      // if (processedData.vehicleValue !== undefined) {
      // prepared.vehicleValue = this.processNumberField(processedData.vehicleValue) || 0;
      // }
      // if (processedData.registrationNumber !== undefined) prepared.registrationNumber = processedData.registrationNumber;
      // if (processedData.engineCapacity !== undefined) prepared.engineCapacity = processedData.engineCapacity;
      if (processedData.budget !== undefined)
        prepared.budget = processedData.budget;
      if (processedData.coverage !== undefined)
        prepared.coverage = processedData.coverage;
      if (processedData.details !== undefined)
        prepared.details = processedData.details;
      if (processedData.contactMethod !== undefined)
        prepared.contactMethod = processedData.contactMethod;
      if (processedData.bestTime !== undefined)
        prepared.bestTime = processedData.bestTime;
      if (processedData.documents !== undefined)
        prepared.documents = processedData.documents as string;
      if (processedData.terms !== undefined)
        prepared.terms = processedData.terms;
      if (processedData.status !== undefined)
        prepared.status = processedData.status;
      if (processedData.timestamp !== undefined) {
        prepared.timestamp =
          this.processDateField(processedData.timestamp) || new Date();
      }

      // Update and return the quote
      await this.quoteRepository.update(id, prepared);
      const updated = await this.quoteRepository.findOne({ where: { id } });

      if (!updated) {
        throw new NotFoundException(
          `Quote with id ${id} not found after update`,
        );
      }

      return {
        success: true,
        message: 'Quote updated successfully',
        data: updated,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      return {
        success: false,
        message: `Failed to update quote with id ${id}`,
        error: error.message,
      };
    }
  }

  async updateStatus(id: number, status: string) {
    try {
      // confirm if claim exists
      const quote = await this.quoteRepository.findOne({ where: { id } });
      if (!quote) {
        throw new NotFoundException(`quote with id ${id} not found`);
      }
      const updatedQuote = await this.quoteRepository.save({
        ...quote,
        status,
      });
      return {
        success: true,
        message: 'Quote status updated successfully',
        data: updatedQuote,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      return {
        success: false,
        message: `Failed to update quote status with id ${id}`,
        error: error.message,
      };
    }
  }

  async remove(id: number): Promise<ApiResponse<void>> {
    try {
      const quote = await this.quoteRepository.findOne({ where: { id } });
      if (!quote) {
        throw new NotFoundException(`Quote with id ${id} not found`);
      }

      await this.quoteRepository.delete(id);
      return {
        success: true,
        message: 'Quote deleted successfully',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      return {
        success: false,
        message: `Failed to delete quote with id ${id}`,
        error: error.message,
      };
    }
  }

  // Additional method to find quotes by status
  async findByStatus(status: string): Promise<ApiResponse<Quote[]>> {
    try {
      const quotes = await this.quoteRepository.find({
        where: { status },
        order: { created_at: 'DESC' },
      });
      return {
        success: true,
        message: `Quotes with status '${status}' retrieved successfully`,
        data: quotes.map((quote) => ({ ...quote, documents: quote.documents ? JSON.parse(quote.documents) : [] })),
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to retrieve quotes with status '${status}'`,
        error: error.message,
      };
    }
  }

  // Additional method to find quotes by product type
  async findByProduct(product: string): Promise<ApiResponse<Quote[]>> {
    try {
      const quotes = await this.quoteRepository.find({
        where: { product },
        order: { created_at: 'DESC' },
      });
      return {
        success: true,
        message: `Quotes for product '${product}' retrieved successfully`,
        data: quotes.map((quote) => ({ ...quote, documents: quote.documents ? JSON.parse(quote.documents) : [] }))
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to retrieve quotes for product '${product}'`,
        error: error.message,
      };
    }
  }
}
