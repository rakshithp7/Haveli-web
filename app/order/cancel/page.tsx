'use client';

import { useRouter } from 'next/navigation';
import { XCircle, ArrowLeft, ShoppingCart, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function CancelPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto px-4">
        <Card className="p-8 text-center">
          {/* Cancel Icon */}
          <XCircle className="w-20 h-20 text-amber-500 mx-auto mb-6" />
          
          {/* Header */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Payment Cancelled
          </h1>
          
          {/* Message */}
          <p className="text-gray-600 mb-6">
            Your payment was cancelled and no charges were made to your account. 
            Your cart items are still saved if you'd like to try again.
          </p>
          
          {/* Reasons */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-medium text-gray-900 mb-3">Common reasons for cancellation:</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">•</span>
                <span>You decided not to complete the purchase</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">•</span>
                <span>There was an issue with your payment method</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">•</span>
                <span>You want to modify your order</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">•</span>
                <span>You accidentally closed the payment window</span>
              </li>
            </ul>
          </div>
          
          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={() => router.push('/order/checkout')} 
              className="w-full bg-amber-500 hover:bg-amber-600"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Payment Again
            </Button>
            
            <Button 
              onClick={() => router.push('/order')} 
              variant="outline" 
              className="w-full"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
            
            <Button 
              onClick={() => router.push('/')} 
              variant="ghost" 
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
          
          {/* Help Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-2">Need help?</p>
            <div className="text-sm text-gray-600">
              <p className="mb-1">
                Call us at{' '}
                <a href="tel:(555)123-4567" className="text-amber-600 hover:text-amber-700 font-medium">
                  (555) 123-4567
                </a>
              </p>
              <p>
                Email:{' '}
                <a href="mailto:support@haveli.com" className="text-amber-600 hover:text-amber-700 font-medium">
                  support@haveli.com
                </a>
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
