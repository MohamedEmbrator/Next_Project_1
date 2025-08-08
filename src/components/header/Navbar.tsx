"use client";
import Link from "next/link";
import styles from "./header.module.css";
import { GrTechnology } from "react-icons/gr";
import { useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { IoMdClose } from "react-icons/io";

interface NavbarProps {
  isAdmin: boolean;
}

const Navbar = ({ isAdmin }: NavbarProps) => {
  const [toggle, setToggle] = useState<boolean>(false);
  return (
    <nav className={styles.navbar}>
      <div>
        <Link href="/" className={styles.logo}>
          CLOUD
          <GrTechnology />
          HOSTING
        </Link>
        <div className={styles.menu}>
          {!toggle && <AiOutlineMenu onClick={() => setToggle((prev) => !prev)} />}
          {toggle && <IoMdClose onClick={() => setToggle((prev) => !prev)} />}
        </div>
      </div>
      <div className={styles.navLinksWrapper} style={{clipPath: toggle && "polygon(0 0, 100% 0, 100% 100%, 0 100%)" || ""}}>
        <ul className={styles.navLinks}>
          <Link href="/" className={styles.navLink} onClick={() => setToggle(false)}>
            Home
          </Link>
          <Link href="/articles?pageNumber=1" className={styles.navLink} onClick={() => setToggle(false)}>
            Articles
          </Link>
          <Link href="/about" className={styles.navLink} onClick={() => setToggle(false)}>
            About
          </Link>
          {isAdmin && (
            <Link href="/admin" className={styles.navLink} onClick={() => setToggle(false)}>
            Admin Dashboard
            </Link>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
