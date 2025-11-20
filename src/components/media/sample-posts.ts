import { MediaItem } from "./index";

export interface Post {
  id: number;
  author: {
    name: string;
    avatar: string;
    username: string;
  };
  content: string;
  timestamp: string;
  media: MediaItem[];
}

export const samplePosts: Post[] = [
  {
    id: 1,
    author: {
      name: "Sarah Chen",
      avatar: "https://i.pravatar.cc/150?img=1",
      username: "@sarahchen",
    },
    content: "Amazing sunset from my trip to Santorini! 🌅",
    timestamp: "2h ago",
    media: [
      {
        id: 1,
        type: "image",
        src: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800&h=600&fit=crop",
        title: "Beautiful Sunset",
      },
    ],
  },
  {
    id: 2,
    author: {
      name: "Alex Rivera",
      avatar: "https://i.pravatar.cc/150?img=33",
      username: "@alexrivera",
    },
    content: "Office tour of our new studio space! Check it out 🎥",
    timestamp: "5h ago",
    media: [
      {
        id: 2,
        type: "image",
        src: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop",
        title: "Office Space 1",
      },
      {
        id: 3,
        type: "image",
        src: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=600&fit=crop",
        title: "Office Space 2",
      },
    ],
  },
  {
    id: 3,
    author: {
      name: "Jordan Lee",
      avatar: "https://i.pravatar.cc/150?img=12",
      username: "@jordanlee",
    },
    content: "Food tour in Tokyo was incredible! 🍜🍱🍣",
    timestamp: "1d ago",
    media: [
      {
        id: 4,
        type: "image",
        src: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=600&fit=crop",
        title: "Delicious Ramen",
      },
      {
        id: 5,
        type: "image",
        src: "https://images.unsplash.com/photo-1564489563601-c53cfc451e93?w=800&h=600&fit=crop",
        title: "Fresh Sushi",
      },
      {
        id: 6,
        type: "image",
        src: "https://images.unsplash.com/photo-1576423772086-13879a85e9e9?w=800&h=600&fit=crop",
        title: "Traditional Bento",
      },
    ],
  },
  {
    id: 4,
    author: {
      name: "Maya Patel",
      avatar: "https://i.pravatar.cc/150?img=5",
      username: "@mayapatel",
    },
    content: "Weekend adventures captured 📸✨ #nature #hiking",
    timestamp: "2d ago",
    media: [
      {
        id: 7,
        type: "image",
        src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
        title: "Mountain View",
      },
      {
        id: 8,
        type: "video",
        src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        thumbnail:
          "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
        title: "Forest Walk",
      },
      {
        id: 9,
        type: "image",
        src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop",
        title: "Lake Reflection",
      },
      {
        id: 10,
        type: "image",
        src: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&h=600&fit=crop",
        title: "Wild Flowers",
      },
    ],
  },
  {
    id: 5,
    author: {
      name: "Chris Morgan",
      avatar: "https://i.pravatar.cc/150?img=13",
      username: "@chrismorgan",
    },
    content:
      "Behind the scenes of our latest photoshoot 📷 Lighting setup and camera gear!",
    timestamp: "3d ago",
    media: [
      {
        id: 11,
        type: "image",
        src: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&h=600&fit=crop",
        title: "Camera Setup",
      },
      {
        id: 12,
        type: "image",
        src: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&h=600&fit=crop",
        title: "Lighting Equipment",
      },
      {
        id: 13,
        type: "image",
        src: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&h=600&fit=crop",
        title: "Studio Setup",
      },
      {
        id: 14,
        type: "image",
        src: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&h=600&fit=crop",
        title: "Final Shot",
      },
      {
        id: 15,
        type: "video",
        src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        thumbnail:
          "https://images.unsplash.com/photo-1574169208507-84376144848b?w=800&h=600&fit=crop",
        title: "BTS Video",
      },
    ],
  },
];
