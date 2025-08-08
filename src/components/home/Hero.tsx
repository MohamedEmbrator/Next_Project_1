import Image from "next/image";
import { TiTick } from "react-icons/ti";
import CloudImage from "../../../public/cloud-hosting.png";
import styles  from "./hero.module.css";
const Hero = () => {
  return (
    <div className={`${styles.hero} h-[calc(100vh_-_100px)] flex items-center justify-around py-0 px-8 text-[rgb(10,9,9)]`}>
      <div className={`${styles.heroLeft}`}>
        <h1 className="text-[44px] font-bold text-black">Cloud Hosting</h1>
        <p className="text-[21px]">The Web Hosting Solution For Your Online Success</p>
        <div className="p-5 mt-3.5">
          <div className="flex items-center text-[21px] font-bold mb-1.5 text-[#555]">
            <TiTick /> Easy To Use Control Panel
          </div>
          <div className="flex items-center text-[21px] font-bold mb-1.5 text-[#555]">
            <TiTick /> Secure Hosting
          </div>
          <div className="flex items-center text-[21px] font-bold mb-1.5 text-[#555]">
            <TiTick /> Website Maintenance
          </div>
        </div>
      </div>
      <div>
        <Image src={CloudImage} alt="Cloud" width={500} height={500} />
      </div>
    </div>
  );
};

export default Hero;
