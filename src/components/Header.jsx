"use client"
import React from "react";
import Link from "next/link";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const Header = () => {

  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const closeSheet = () => setIsSheetOpen(false);

  return (
    <header className="text-[#F0FFFF] flex items-center px-6 md:px-16 py-3 w-full justify-between">
      <h1 className="sm:text-lg text-md font-medium">Social Analysis</h1>
      <div className="flex items-center gap-6">
        <nav className="hidden lg:flex items-center gap-4">
          <Link href="#" className="text-[16px] ">Dashboard</Link>
          <Link href="#" className="text-[16px] ">Public Profiles</Link>
          <Link href="#" className="text-[16px] ">Posts</Link>
          <Link href="#" className="text-[16px] ">Stories</Link>
          <Link href="#" className="text-[16px] ">Reels</Link>
          <Link href="#" className="text-[16px]">Ads</Link>
        </nav>
        <button className="hidden lg:block bg-gradient-to-r from-teal-400 to-blue-500 text-white text-[16px] px-4 py-2 rounded-md font-medium hover:opacity-90">
          New Analysis
        </button>
      </div>
      {/* <h1 className="text-lg font-medium">Social Analysis</h1> */}
      <div className="lg:hidden ">
          <Sheet open={isSheetOpen}  onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <button
                aria-label="Open Menu"
                className="text-[#F0FFFF] focus:outline-none"
              >
                <Menu />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-[#111827] text-[#F0FFFF] w-[250px]">
              <SheetHeader>
                <SheetTitle className="text-[#F0FFFF]">Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-4">
                <Link href="#" className="text-[16px]" onClick={closeSheet}>
                  Dashboard
                </Link>
                <Link href="#" className="text-[16px]" onClick={closeSheet}>
                  Public Profiles
                </Link>
                <Link href="#" className="text-[16px]" onClick={closeSheet}>
                  Posts
                </Link>
                <Link href="#" className="text-[16px]" onClick={closeSheet}>
                  Stories
                </Link>
                <Link href="#" className="text-[16px]" onClick={closeSheet}>
                  Reels
                </Link>
                <Link href="#" className="text-[16px]" onClick={closeSheet}>
                  Ads
                </Link>
                <button
                  className="mr-16 bg-gradient-to-r from-teal-400 to-blue-500 text-white text-[14px] px-2 py-2 rounded-md font-medium hover:opacity-90 mt-4"
                  onClick={closeSheet}
                >
                  New Analysis
                </button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
    </header>
  );
};

export default Header;







