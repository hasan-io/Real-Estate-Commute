import styled from "styled-components";

/* ================= GLOBAL ================= */

export const PageContainer = styled.div`
  background: linear-gradient(to bottom, #020617, #0f172a);
  min-height: 100vh;
  color: #e2e8f0;
  font-family: "Inter", sans-serif;
`;

/* ================= NAVBAR ================= */

export const Navbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 40px;
  background: rgba(2, 6, 23, 0.9);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #1e293b;
`;

export const Logo = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #38bdf8;
`;

export const NavLinks = styled.div`
  display: flex;
  gap: 25px;
`;

export const NavItem = styled.a`
  color: #cbd5f5;
  cursor: pointer;
  font-size: 15px;

  &:hover {
    color: #38bdf8;
  }
`;

export const NavButton = styled.button`
  padding: 10px 18px;
  background: #38bdf8;
  border: none;
  border-radius: 8px;
  color: black;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #0ea5e9;
  }
`;

/* ================= HERO ================= */

export const HeroSection = styled.div`
  padding: 80px 40px;
  text-align: center;
`;

export const HeroTitle = styled.h1`
  font-size: 42px;
  font-weight: bold;
  margin-bottom: 20px;
`;

export const HeroSubtitle = styled.p`
  color: #94a3b8;
  font-size: 18px;
  margin-bottom: 30px;
`;

/* ================= SEARCH BAR ================= */

export const SearchContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
`;

export const SearchInput = styled.input`
  width: 400px;
  padding: 12px;
  border-radius: 10px;
  border: none;
  outline: none;
  background: #1e293b;
  color: white;
`;

export const SearchButton = styled.button`
  padding: 12px 20px;
  background: #22c55e;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background: #16a34a;
  }
`;

/* ================= FILTER BAR ================= */

export const FilterBar = styled.div`
  display: flex;
  gap: 15px;
  padding: 20px 40px;
  flex-wrap: wrap;
`;

export const FilterSelect = styled.select`
  padding: 10px;
  border-radius: 8px;
  background: #1e293b;
  color: white;
  border: none;
`;

/* ================= GRID ================= */

export const PropertyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
  padding: 30px 40px;
`;

/* ================= CARD ================= */

export const PropertyCard = styled.div`
  background: #1e293b;
  border-radius: 18px;
  overflow: hidden;
  transition: 0.3s;
  cursor: pointer;
  position: relative;

  &:hover {
    transform: translateY(-8px);
  }
`;

export const PropertyImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

export const Tag = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  background: #22c55e;
  padding: 5px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: bold;
`;

export const PropertyContent = styled.div`
  padding: 15px;
`;

export const PropertyTitle = styled.h2`
  font-size: 18px;
  margin-bottom: 6px;
`;

export const PropertyLocation = styled.p`
  font-size: 14px;
  color: #94a3b8;
`;

export const PropertyPrice = styled.p`
  font-size: 18px;
  color: #22c55e;
  font-weight: bold;
  margin-top: 10px;
`;

/* ================= PROPERTY DETAILS ================= */

export const PropertyDetails = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`;

export const DetailItem = styled.span`
  font-size: 13px;
  color: #cbd5f5;
`;

/* ================= BUTTON ================= */

export const ViewButton = styled.button`
  width: 100%;
  margin-top: 15px;
  padding: 10px;
  background: #38bdf8;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background: #0ea5e9;
  }
`;

/* ================= SIDEBAR ================= */

export const Sidebar = styled.div`
  width: 250px;
  background: #020617;
  padding: 20px;
  height: 100vh;
`;

export const SidebarItem = styled.div`
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: #1e293b;
  }
`;

/* ================= FOOTER ================= */

export const Footer = styled.div`
  padding: 40px;
  text-align: center;
  background: #020617;
  margin-top: 40px;
`;

export const FooterText = styled.p`
  color: #94a3b8;
  font-size: 14px;
`;

/* ================= RESPONSIVE ================= */

export const MobileMenu = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block;
  }
`;

export const DesktopOnly = styled.div`
  @media (max-width: 768px) {
    display: none;
  }
`;

export const ResponsiveGrid = styled(PropertyGrid)`
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;