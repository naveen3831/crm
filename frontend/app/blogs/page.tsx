"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Calendar, Clock, ArrowRight, BookOpen } from "lucide-react";
import GlassCard from "../../components/ui/GlassCard";
import Button from "../../components/ui/Button";

interface Post {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  gradient: string;
}

export default function BlogsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Sales", "Customer Success", "Security", "Billing"];

  const blogPosts: Post[] = [
    {
      id: "accelerate-sales-pipeline",
      title: "How to Accelerate Your Sales Pipeline in 2026",
      excerpt: "Learn how to qualify incoming leads, automate quotation follow-ups, and convert more prospects into active accounts.",
      category: "Sales",
      author: "Alex Sterling",
      date: "Jul 18, 2026",
      readTime: "5 min read",
      gradient: "from-blue-700 to-indigo-800"
    },
    {
      id: "role-based-access-control",
      title: "Best Practices for Role-Based Access Control (RBAC)",
      excerpt: "Ensure strict data isolation and auditing by configuring precise permissions for admin operators and customer profiles.",
      category: "Security",
      author: "Marcus Vance",
      date: "Jul 14, 2026",
      readTime: "7 min read",
      gradient: "from-purple-800 to-navy-900"
    },
    {
      id: "reducing-billing-friction",
      title: "Reducing Invoicing Friction via Online UPI & Cards",
      excerpt: "Discover how integrating Razorpay and Stripe directly into your client invoicing dashboard improves payment timelines.",
      category: "Billing",
      author: "Elena Rostova",
      date: "Jul 10, 2026",
      readTime: "4 min read",
      gradient: "from-emerald-700 to-blue-800"
    },
    {
      id: "building-customer-retention",
      title: "Building Customer Retention through Support Tickets",
      excerpt: "How organizing support responses, tracking resolution times, and adding SMTP verification impacts CSAT.",
      category: "Customer Success",
      author: "Sarah Jenkins",
      date: "Jun 28, 2026",
      readTime: "6 min read",
      gradient: "from-pink-700 to-purple-900"
    }
  ];

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPost = blogPosts[0];

  return (
    <div className="min-h-screen py-10 sm:py-16 px-4 sm:px-8 md:px-12 max-w-7xl mx-auto flex flex-col gap-10 sm:gap-12">
      {/* Header */}
      <section className="text-center max-w-2xl mx-auto flex flex-col gap-4">
        <h1 className="display-lg text-gradient font-heading">CRM Insights & Resources</h1>
        <p className="text-base text-gray-700 font-medium font-sans leading-relaxed">
          Stay informed with industry reviews, design guidelines, tech-stack optimization tips, and feature launches.
        </p>

        {/* Search Bar */}
        <div className="relative mt-4 max-w-md mx-auto w-full">
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-orange-200 text-[#1a0f00] font-medium text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-500 shadow-sm"
          />
          <Search size={18} className="absolute left-4 top-3.5 text-blue-500" />
        </div>
      </section>

      {/* Categories filter bar */}
      <section className="flex flex-wrap items-center justify-center gap-3 border-y border-gray-200 py-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide font-heading transition-all ${
              selectedCategory === cat
                ? "bg-orange-600 text-white shadow-md"
                : "bg-white border border-orange-200 text-gray-600 hover:text-[#1a0f00] hover:border-orange-500 shadow-sm"
            }`}
          >
            {cat}
          </button>
        ))}
      </section>

      {/* Featured Blog */}
      {searchQuery === "" && selectedCategory === "All" && (
        <section className="w-full">
          <Link href={`/blogs/${featuredPost.id}`}>
            <GlassCard className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 p-5 sm:p-8 hover:border-orange-500/20 transition-all cursor-pointer group bg-white border border-blue-100 shadow-md">
              <div className={`w-full h-48 sm:h-64 lg:h-full min-h-[180px] rounded-xl bg-gradient-to-tr ${featuredPost.gradient} flex items-center justify-center relative overflow-hidden`}>
                <BookOpen size={48} className="text-white/20" />
                <div className="absolute inset-0 bg-black/10"></div>
              </div>
              <div className="flex flex-col justify-between py-2">
                <div className="flex flex-col gap-4">
                  <div className="inline-flex max-w-fit px-2.5 py-1 rounded-md bg-orange-100 text-orange-700 text-xs font-bold font-heading uppercase tracking-wide">
                    {featuredPost.category}
                  </div>
                  <h2 className="font-heading font-bold text-xl sm:text-2xl lg:text-3xl text-[#1a0f00] group-hover:text-orange-700 transition-colors leading-tight">
                    {featuredPost.title}
                  </h2>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-sans font-medium">
                    {featuredPost.excerpt}
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-between border-t border-gray-100 pt-4 mt-5 gap-2 text-xs text-gray-600">
                  <div className="flex flex-wrap items-center gap-3">
                    <span>By <strong className="text-[#1a0f00]">{featuredPost.author}</strong></span>
                    <span className="flex items-center gap-1"><Calendar size={13} /> {featuredPost.date}</span>
                    <span className="flex items-center gap-1"><Clock size={13} /> {featuredPost.readTime}</span>
                  </div>
                  <span className="text-orange-700 font-bold group-hover:translate-x-1.5 transition-transform flex items-center gap-1">
                    Read Article <ArrowRight size={13} />
                  </span>
                </div>
              </div>
            </GlassCard>
          </Link>
        </section>
      )}

      {/* Posts Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredPosts.length > 0 ? (
          filteredPosts
            .filter((p) => searchQuery !== "" || selectedCategory !== "All" || p.id !== featuredPost.id)
            .map((post) => (
              <Link key={post.id} href={`/blogs/${post.id}`} className="flex">
                <GlassCard className="flex flex-col justify-between h-full p-5 hover:border-orange-500/20 transition-all cursor-pointer group w-full bg-white border border-blue-100 shadow-md">
                  <div className="flex flex-col gap-4">
                    <div className={`w-full h-40 sm:h-44 rounded-lg bg-gradient-to-tr ${post.gradient} flex items-center justify-center relative overflow-hidden`}>
                      <BookOpen size={32} className="text-white/25" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] font-bold text-orange-700 font-heading uppercase tracking-widest">
                        {post.category}
                      </span>
                      <h3 className="font-heading font-bold text-lg text-[#1a0f00] group-hover:text-orange-700 transition-colors leading-snug">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-700 leading-relaxed font-sans">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-5 text-xs text-gray-600">
                    <span className="font-bold text-[#1a0f00]">{post.author}</span>
                    <span className="flex items-center gap-1 font-medium"><Clock size={11} /> {post.readTime}</span>
                  </div>
                </GlassCard>
              </Link>
            ))
        ) : (
          <div className="col-span-full text-center py-16 text-gray-600 font-medium">
            <p>No blog posts found matching those criteria.</p>
          </div>
        )}
      </section>
    </div>
  );
}

