import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Image } from './entity/image.entity';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class ImageRepository {
  constructor(
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
  ) {}

  // feedback에 따라 image 경로 저장
  async createImage(feedbackId: number, imagePath: string): Promise<Image> {
    const image = new Image();
    image.feedback.feedbackId = feedbackId;
    image.imagePath = imagePath;
    await this.imageRepository.save(image);

    return image;
  }

  // feedback image 조회
  async getImagesByFeedbackId(feedbackId: number): Promise<Image[]> {
    return await this.imageRepository.find({
      where: { feedback: { feedbackId } },
    });
  }

  // image 삭제
  async deleteImage(imageId: number): Promise<DeleteResult> {
    return await this.imageRepository.delete({ imageId });
  }

  // feedbackId에 해당하는 image 삭제
  async deleteImagesByFeedbackId(feedbackId: number): Promise<DeleteResult> {
    return await this.imageRepository.delete({ feedback: { feedbackId } });
  }
}
