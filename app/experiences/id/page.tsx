import { notFound } from 'next/navigation';

const experienceData = {
  '1': {
    title: 'Luxury Spa Experience',
    description: 'Relaxing spa treatment with premium amenities',
    price: 2999,
    duration: '2 hours',
    image: '/images/spa.jpg'
  },
  '2': {
    title: 'Adventure Trekking',
    description: 'Thrilling mountain trek with experienced guides',
    price: 1999,
    duration: '6 hours',
    image: '/images/trekking.jpg'
  },
  '3': {
    title: 'Gourmet Cooking Class',
    description: 'Learn cooking from master chefs with hands-on experience',
    price: 3499,
    duration: '3 hours',
    image: '/images/cooking.jpg'
  }
};

interface PageProps {
  params: {
    id: string;
  };
}

export default function ExperienceDetailPage({ params }: PageProps) {
  const { id } = params;
  
  // Check if experience exists
  const experience = experienceData[id as keyof typeof experienceData];
  
  if (!experience) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <a href="/experiences" className="text-blue-600 hover:text-blue-800">
            ← Back to Experiences
          </a>
        </nav>

        {/* Experience Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Image Section */}
            <div className="md:w-1/2">
              <div className="h-64 md:h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Image: {experience.image}</span>
              </div>
            </div>
            
            {/* Content Section */}
            <div className="md:w-1/2 p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {experience.title}
              </h1>
              
              <p className="text-gray-600 mb-6">
                {experience.description}
              </p>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-500">Duration:</span>
                  <span className="font-medium">{experience.duration}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-500">Price:</span>
                  <span className="text-2xl font-bold text-green-600">
                    ₹{experience.price}
                  </span>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="space-y-3">
                <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-200">
                  Book Now
                </button>
                
                <button className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition duration-200">
                  Add to Wishlist
                </button>
              </div>
            </div>
          </div>
          
          {/* Additional Details Section */}
          <div className="p-6 border-t border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Experience Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
              <div>
                <h3 className="font-medium mb-2">What's Included</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Professional guidance</li>
                  <li>All necessary equipment</li>
                  <li>Refreshments</li>
                  <li>Photo session</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">Important Notes</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Arrive 15 minutes early</li>
                  <li>Wear comfortable clothing</li>
                  <li>Bring valid ID proof</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps) {
  const { id } = params;
  const experience = experienceData[id as keyof typeof experienceData];
  
  return {
    title: experience ? `${experience.title} - Experience` : 'Experience Not Found',
    description: experience?.description,
  };
}

// Static generation for better performance (optional)
export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' }, 
    { id: '3' },
  ];
}
