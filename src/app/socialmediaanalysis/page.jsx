import Header from "@/components/Header";
import SearchBar from "@/components/Searchbar";
import Navbar from "@/components/Navbar";
import NavbarGraph from "@/components/NavbarGraph";

export default function SocialMediaAnalysis() {
  return (
    <div className="bg-[#111827] h-screen">
    <div className="max-w-screen-2xl mx-auto">

    <div className="">
      
    {/* <Header/> */}
    {/* <Navbar /> */}
    <NavbarGraph />

    
    </div>
    <div className="text-[#ebebeb] "><hr/></div>
    
    <div className=" mt-20 bg-[#111827] py-20 px-[20px] sm:px-[40px] md:px-[70px]">
      <SearchBar />
    </div>
    </div>
    </div>
  );
}
