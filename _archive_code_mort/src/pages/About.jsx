import React from 'react';
import { Code, Users, Target, Award, ArrowRight } from 'lucide-react';

const About = () => {
    const features = [
        {
            icon: Code,
            title: 'Modern Development',
            description: 'Using cutting-edge technologies and best practices to deliver exceptional web applications.',
        },
        {
            icon: Users,
            title: 'Community Driven',
            description: 'Building a strong community of developers who learn, share, and grow together.',
        },
        {
            icon: Target,
            title: 'Goal Oriented',
            description: 'Focused on achieving measurable results and delivering value to our users.',
        },
        {
            icon: Award,
            title: 'Quality First',
            description: 'Committed to maintaining high standards in code quality, design, and user experience.',
        },
    ];

    const stats = [
        { label: 'Projects Completed', value: '150+' },
        { label: 'Happy Clients', value: '200+' },
        { label: 'Team Members', value: '25+' },
        { label: 'Years Experience', value: '8+' },
    ];

    return (
        <div className="mx-auto space-y-12">
            {/* Hero Section */}
            <div className="text-center space-y-6">
                <h1 className="text-5xl font-bold text-gray-900 leading-tight">
                    About <span className="text-blue-600">DCodeMania</span>
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    We are passionate developers dedicated to creating exceptional digital experiences
                    through innovative web technologies and thoughtful design.
                </p>
            </div>

            {/* Stats Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center">
                            <div className="text-3xl font-bold mb-2">{stat.value}</div>
                            <div className="text-blue-100 text-sm">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Story Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                    <h2 className="text-3xl font-bold text-gray-900">Our Story</h2>
                    <div className="space-y-4 text-gray-600">
                        <p>
                            Founded in 2016, DCodeMania started as a small team of passionate developers
                            who believed in the power of clean code and beautiful design. We saw an
                            opportunity to bridge the gap between technical excellence and user experience.
                        </p>
                        <p>
                            Over the years, we've grown into a full-service development agency, working
                            with startups, established businesses, and everything in between. Our mission
                            remains the same: to create digital solutions that not only work flawlessly
                            but also delight users.
                        </p>
                        <p>
                            Today, we continue to push the boundaries of what's possible on the web,
                            embracing new technologies while maintaining our commitment to quality and
                            craftsmanship.
                        </p>
                    </div>
                </div>
                <div className="relative">
                    <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8 flex items-center justify-center">
                        <div className="text-6xl font-bold text-blue-600 opacity-20">
                            DCodeMania
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Grid */}
            <div className="space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">What Sets Us Apart</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        We combine technical expertise with creative vision to deliver solutions
                        that exceed expectations.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300"
                        >
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <feature.icon className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Mission Section */}
            <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
                <div className="max-w-4xl mx-auto text-center space-y-6">
                    <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
                    <p className="text-xl text-gray-600 leading-relaxed">
                        To empower businesses and individuals by creating exceptional digital experiences
                        that combine cutting-edge technology with intuitive design, fostering innovation
                        and driving success in the digital age.
                    </p>
                    <div className="pt-4">
                        <a
                            href="https://dcodemania.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        >
                            Visit Our Website
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </a>
                    </div>
                </div>
            </div>

            {/* Values Section */}
            <div className="space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {['Innovation', 'Quality', 'Collaboration'].map((value, index) => (
                        <div key={index} className="text-center p-6">
                            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-white">{value[0]}</span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{value}</h3>
                            <p className="text-gray-600 text-sm">
                                {index === 0 && "We constantly explore new technologies and approaches to stay ahead."}
                                {index === 1 && "Excellence is not negotiable - we deliver nothing but the best."}
                                {index === 2 && "We believe great things happen when talented people work together."}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default About;