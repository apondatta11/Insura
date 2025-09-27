// import { Link } from "react-router";

// const HeroBanner = () => (
//     <div className="hero min-h-screen bg-[url('https://t4.ftcdn.net/jpg/08/14/51/95/360_F_814519583_aBeKi1mOCclfWWDRFOFlgtbQfrzViphL.jpg')] bg-content bg-center">
//         <div className="hero-overlay bg-opacity-90"></div>
//         <div className="w-[90vw] text-foreground flex justify-end align-middle">
//             <div className="max-w-max text-right">
//                 <h1 className="text-5xl font-bold mb-6">Discover Your Perfect Getaway</h1>
//                 <p className="mb-8 text-lg">Explore breathtaking destinations with our expertly crafted tour packages</p>
//                 <Link to="/allpackages" className="btn bg-primary btn-lg text-neutral-content">
//                     Explore All Packages
//                 </Link>
//             </div>
//         </div>
//     </div>
// );

// export default HeroBanner;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowRight, FaShieldHeart, FaHandHoldingHeart} from 'react-icons/fa6';
import { FaHome , FaHeart,  FaUmbrella } from "react-icons/fa";
const HeroBanner = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            id: 1,
            title: "Secure Your Tomorrow Today",
            subtitle: "Protect your family's future with comprehensive life insurance coverage tailored to your needs",
            icon: FaShieldHeart,
            bgGradient: "from-blue-600/20 to-purple-600/20",
            textColor: "text-blue-600",
            ctaText: "Get Your Free Quote",
            image: "/api/placeholder/800/600"
        },
        {
            id: 2,
            title: "Peace of Mind for Life's Journey",
            subtitle: "Expert guidance and flexible policies that grow with you through every stage of life",
            icon: FaHandHoldingHeart,
            bgGradient: "from-green-600/20 to-teal-600/20",
            textColor: "text-green-600",
            ctaText: "Explore Policies",
            image: "/api/placeholder/800/600"
        },
        {
            id: 3,
            title: "Your Family's Safety Net",
            subtitle: "Ensure financial stability and protection for your loved ones when they need it most",
            icon: FaHome,
            bgGradient: "from-orange-600/20 to-red-600/20",
            textColor: "text-orange-600",
            ctaText: "Start Protecting",
            image: "/api/placeholder/800/600"
        }
    ];

    // Auto-slide functionality
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [slides.length]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    const currentSlideData = slides[currentSlide];
    const IconComponent = currentSlideData.icon;

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-sidebar to-muted/30">
            {/* Animated Background Elements */}
            <div className="absolute inset-0">
                <div className={`absolute inset-0 bg-gradient-to-r ${currentSlideData.bgGradient} transition-all duration-1000`} />
                
                {/* Floating Shapes */}
                <div className="absolute top-10 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-float"></div>
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-float-delayed"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/5 rounded-full blur-3xl animate-pulse"></div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
                    {/* Text Content */}
                    <div className="text-center lg:text-left space-y-8">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentSlide}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -50 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="space-y-6"
                            >
                                {/* Icon */}
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, duration: 0.5 }}
                                    className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20"
                                >
                                    <IconComponent className={`text-3xl ${currentSlideData.textColor}`} />
                                </motion.div>

                                {/* Title */}
                                <motion.h1
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3, duration: 0.7 }}
                                    className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
                                >
                                    <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                                        {currentSlideData.title.split(' ').slice(0, -1).join(' ')}
                                    </span>
                                    <br />
                                    <span className={currentSlideData.textColor}>
                                        {currentSlideData.title.split(' ').slice(-1)[0]}
                                    </span>
                                </motion.h1>

                                {/* Subtitle */}
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5, duration: 0.7 }}
                                    className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl"
                                >
                                    {currentSlideData.subtitle}
                                </motion.p>

                                {/* CTA Button */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.7, duration: 0.7 }}
                                    className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                                >
                                    <Link
                                        to="/quote"
                                        className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary 
                                                   text-primary-foreground font-semibold rounded-xl transition-all duration-300 
                                                   transform hover:scale-105 hover:shadow-2xl shadow-lg gap-3"
                                    >
                                        {currentSlideData.ctaText}
                                        <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-200" />
                                    </Link>
                                    
                                    <Link
                                        to="/policies"
                                        className="group inline-flex items-center justify-center px-8 py-4 border-2 border-primary text-primary 
                                                   hover:bg-primary hover:text-primary-foreground font-semibold rounded-xl 
                                                   transition-all duration-300 transform hover:scale-105 gap-3"
                                    >
                                        View All Policies
                                        <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-200" />
                                    </Link>
                                </motion.div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Slide Indicators */}
                        <div className="flex justify-center lg:justify-start items-center gap-4 mt-8">
                            {/* Navigation Arrows */}
                            <button
                                onClick={prevSlide}
                                className="p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 
                                           hover:bg-white/20 transition-all duration-200 group"
                                aria-label="Previous slide"
                            >
                                <svg className="w-5 h-5 text-foreground group-hover:scale-110 transition-transform" 
                                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>

                            {/* Dots */}
                            <div className="flex gap-2">
                                {slides.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => goToSlide(index)}
                                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                            index === currentSlide 
                                                ? 'bg-primary w-8' 
                                                : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                                        }`}
                                        aria-label={`Go to slide ${index + 1}`}
                                    />
                                ))}
                            </div>

                            <button
                                onClick={nextSlide}
                                className="p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 
                                           hover:bg-white/20 transition-all duration-200 group"
                                aria-label="Next slide"
                            >
                                <svg className="w-5 h-5 text-foreground group-hover:scale-110 transition-transform" 
                                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Visual Content */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="relative hidden lg:block"
                    >
                        <div className="relative">
                            {/* Main Illustration Container */}
                            <div className="relative w-full h-96">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentSlide}
                                        initial={{ opacity: 0, scale: 0.5, rotateY: 180 }}
                                        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                                        exit={{ opacity: 0, scale: 1.2, rotateY: -180 }}
                                        transition={{ duration: 0.8, ease: "easeInOut" }}
                                        className="absolute inset-0 flex items-center justify-center"
                                    >
                                        <div className="w-80 h-80 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl 
                                                       backdrop-blur-sm border border-white/20 relative overflow-hidden">
                                            {/* Animated Insurance Illustration */}
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="relative">
                                                    {/* Shield Icon */}
                                                    <div className="w-32 h-32 bg-white/10 rounded-2xl flex items-center justify-center 
                                                                   backdrop-blur-sm border border-white/20">
                                                        <IconComponent className={`text-6xl ${currentSlideData.textColor}`} />
                                                    </div>
                                                    
                                                    {/* Floating Elements */}
                                                    <div className="absolute -top-4 -right-4 w-8 h-8 bg-green-400/20 rounded-full animate-bounce"></div>
                                                    <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-blue-400/20 rounded-full animate-bounce-delayed"></div>
                                                    <div className="absolute top-1/2 -right-8 w-4 h-4 bg-yellow-400/20 rounded-full animate-pulse"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            {/* Floating Stats */}
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1, duration: 0.8 }}
                                className="absolute -bottom-8 -left-8 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20"
                            >
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-foreground">50K+</div>
                                    <div className="text-sm text-muted-foreground">Families Protected</div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.2, duration: 0.8 }}
                                className="absolute -top-8 -right-8 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20"
                            >
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-foreground">99%</div>
                                    <div className="text-sm text-muted-foreground">Claim Success</div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 0.8 }}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            >
                <div className="flex flex-col items-center gap-2">
                    <span className="text-sm text-muted-foreground">Scroll to explore</span>
                    <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center">
                        <motion.div
                            animate={{ y: [0, 12, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            className="w-1 h-3 bg-primary rounded-full mt-2"
                        />
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default HeroBanner;