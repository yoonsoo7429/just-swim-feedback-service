import { Injectable } from '@nestjs/common';
import { ImageRepository } from './image.repository';
import { Image } from './entity/image.entity';

@Injectable()
export class ImageService {
  constructor(private readonly imageRepository: ImageRepository) {}

  /* image 생성 */
  async createImage(
    feedbackImage: string[],
    feedbackId: number,
  ): Promise<Image> {
    for (let i = 0; i < feedbackImage.length; i++) {
      const imagePath = feedbackImage[i];
      return await this.imageRepository.createImage(feedbackId, imagePath);
    }
  }

  // feedback image 조회
  async getImagesByFeedbackId(feedbackId: number): Promise<Image[]> {
    return await this.imageRepository.getImagesByFeedbackId(feedbackId);
  }
}
