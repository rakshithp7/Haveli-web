export type Testimonial = {
  name: string;
  text: string;
  rating: number;
  date?: string;
  imageUrl?: string;
};

export const testimonials: Testimonial[] = [
  {
    name: 'Anita S.',
    text: 'Incredible flavors and warm service. Best butter chicken in town! The ambiance is lovely and perfect for both casual dinners and special occasions. Highly recommended to anyone who loves authentic Indian cuisine.',
    rating: 5,
    date: 'August 15, 2024',
  },
  {
    name: 'Kevin M.',
    text: 'Vegetarian options are plentiful and delicious. Paneer tikka is a must! The naan bread is fresh and perfectly cooked. Service is always attentive and friendly. Will definitely be coming back.',
    rating: 4,
    date: 'July 22, 2024',
  },
  {
    name: 'Priya R.',
    text: "Authentic, fresh, and consistent. Our family's go-to for Indian cuisine for the past year. The biryani is exceptional and rivals what I've had in India. Great value for the quality of food you receive.",
    rating: 5,
    date: 'September 3, 2024',
  },
];
