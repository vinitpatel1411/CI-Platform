import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { Banner } from '../../../models/user-models';

@Component({
  selector: 'app-custom-carousel',
  standalone: true,
  imports: [ CarouselModule, NgOptimizedImage, CommonModule],
  templateUrl: './custom-carousel.component.html',
  styleUrl: './custom-carousel.component.css'
})
export class CustomCarouselComponent {
  slides: Banner[] = [
    {
      bannerId: 1,
      image: '/assets/img/Animal-welfare-&-save-birds-campaign-1.png',
      text: 'Animal-welfare',
      sortOrder: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date()
    },
    {
      bannerId: 2,
      image: '/assets/img/CSR-initiative-stands-for-Coffee--and-Farmer-Equity-4.png',
      text: 'CSR-initiative-stands-for-Coffee',
      sortOrder: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date()
    },
    {
      bannerId: 3,
      image: '/assets/img/Education-Supplies-for-Every--Pair-of-Shoes-Sold-2.png',
      text: 'Education-Supplies-for-Every',
      sortOrder: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date()
    }
  ];

  customOptions: OwlOptions = {
    loop: true,
    items: 1,
    margin: 20,
    autoplay: true,
    autoplayTimeout: 3000,
    autoplayHoverPause: true,
    dots: true,
    stagePadding: 0
  }
}
