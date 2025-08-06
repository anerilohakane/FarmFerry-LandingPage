'use client';
import { ShoppingCartIcon, ArrowRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

export default function NewLaunches() {
  const products = [
    { id: 1, name: 'Tomoto', weight: '200gm', price: '₹110', image: '/images/explore/tomato.png', slug: 'Tomoto' },
    { id: 2, name: 'Grapes', weight: '120gm', price: '₹66', image: '/images/explore/grapes.png', slug: 'Grapes' },
    { id: 3, name: 'Butter', weight: '120gm', price: '₹60', image: '/images/explore/butter.png', slug: 'Butter' },
    { id: 4, name: 'Cornflakes', weight: '60gm', price: '₹75', image: '/images/explore/cornflakes.png', slug: 'Cornflakes' },
    { id: 5, name: 'Mango Pickles', weight: '17gm', price: '₹63', image: '/images/explore/pickles-mango.png', slug: 'Mango Pickles' },
    { id: 6, name: 'Pistachios', weight: '450gm', price: '₹245 – ₹250', image: '/images/explore/pistachios.png', slug: 'Pistachios' }
  ];

  const scrollerRef = useRef(null);
  const animationRef = useRef(null);
  const scrollAmountRef = useRef(0);

  const [isScrolling, setIsScrolling] = useState(true);
  const [dragging, setDragging] = useState(false);
  const dragStartX = useRef(0);
  const dragStartScroll = useRef(0);

  // Keep scroll amount in sync for seamless auto-scroll resume
  const syncScrollAmount = () => {
    const scroller = scrollerRef.current;
    if (scroller) {
      scrollAmountRef.current = scroller.scrollLeft;
    }
  };

  // Auto-scroll loop
  const startScrolling = () => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const step = () => {
      if (scroller && isScrolling && !dragging) {
        scrollAmountRef.current += 0.5;
        if (scrollAmountRef.current >= scroller.scrollWidth / 2) {
          scrollAmountRef.current = 0;
          scroller.scrollLeft = 0;
        }
        scroller.scrollLeft = scrollAmountRef.current;
      }
      animationRef.current = requestAnimationFrame(step);
    };
    animationRef.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    startScrolling();
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isScrolling, dragging]);

  // Mouse/touch drag handlers
  const handleUserScrollStart = e => {
    setIsScrolling(false);
    setDragging(true);
    const scroller = scrollerRef.current;

    if (e.type === 'touchstart') {
      dragStartX.current = e.touches[0].clientX;
    } else {
      dragStartX.current = e.clientX;
    }
    dragStartScroll.current = scroller.scrollLeft;
  };

  const handleUserScrollMove = e => {
    if (!dragging) return;
    const scroller = scrollerRef.current;
    let clientX;
    if (e.type === 'touchmove') {
      clientX = e.touches[0].clientX;
    } else {
      clientX = e.clientX;
    }
    const diff = dragStartX.current - clientX;
    scroller.scrollLeft = dragStartScroll.current + diff;
    scrollAmountRef.current = scroller.scrollLeft;
  };

  const handleUserScrollEnd = () => {
    setDragging(false);
    syncScrollAmount();
    setIsScrolling(true);
  };

  const handleScroll = () => {
    syncScrollAmount();
  };

  // Mouse leave should also resume auto-scroll
  const handleMouseLeave = () => {
    if (dragging) {
      setDragging(false);
      syncScrollAmount();
      setIsScrolling(true);
    } else {
      setIsScrolling(true);
    }
  };

  // Prevent default drag image
  const handleDragStart = e => e.preventDefault();

  const redirectToPlayStore = () => {
    window.open('https://play.google.com/store', '_blank');
  };

  return (
    <section className="py-8 px-4 bg-green-100 select-none">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">New Launches</h2>
          <div className="w-16 h-1 bg-green-600 mx-auto mt-2"></div>
        </div>

        <div
          ref={scrollerRef}
          className="flex overflow-x-hidden py-4 gap-4 no-scrollbar"
          onMouseDown={handleUserScrollStart}
          onTouchStart={handleUserScrollStart}
          onMouseMove={handleUserScrollMove}
          onTouchMove={handleUserScrollMove}
          onMouseUp={handleUserScrollEnd}
          onTouchEnd={handleUserScrollEnd}
          onMouseLeave={handleMouseLeave}
          onScroll={handleScroll}
          
          // Pause auto-scroll when cursor is over the slider
          onMouseEnter={() => setIsScrolling(false)}
          onMouseLeave={() => {
            if (!dragging) setIsScrolling(true);
          }}

          style={{
            cursor: dragging ? 'grabbing' : 'grab',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            msUserSelect: 'none',
          }}
          draggable={false}
        >
          {[...products, ...products].map((product, index) => (
            <div
              key={`${product.id}-${index}`}
              className="flex-shrink-0 w-48 bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              onDragStart={handleDragStart}
            >
              <div className="h-40 relative">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  draggable={false}
                />
              </div>
              <div className="p-3">
                <h3 className="font-medium text-sm text-gray-800 line-clamp-1">{product.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{product.weight}</p>
                <div className="mt-2 flex justify-between items-center">
                  <span className="font-bold text-sm text-green-600">{product.price}</span>
                  <button
                    className="bg-green-600 hover:bg-green-700 text-white p-1.5 rounded-full transition-colors"
                    onClick={e => {
                      e.stopPropagation();
                      // Add to cart logic here
                    }}
                  >
                    <ShoppingCartIcon size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={redirectToPlayStore}
            className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors shadow-md hover:shadow-lg"
          >
            Available on App
            <ArrowRight size={16} className="ml-2" />
          </button>
        </div>
      </div>
    </section>
  );
}
