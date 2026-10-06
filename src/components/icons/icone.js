import {
  FaUsers,
  FaTrashAlt,
  FaArrowRight,
  FaPen,
  FaClock,
  FaMedal,
  FaBullseye,
  FaBookOpen,
  FaBoxOpen,
  FaUpload,
  FaBookmark,
  FaPlus,
  FaRegStar,
} from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import {  IoIosArrowBack } from "react-icons/io";
import { FiTrash2, FiDownload } from "react-icons/fi";
import { BiWorld } from "react-icons/bi";
import { CiCircleInfo } from "react-icons/ci";
import { ImCross } from "react-icons/im";
import { HiRefresh } from "react-icons/hi";
import { GoFileDirectoryFill } from "react-icons/go";
import { RxCross2 } from "react-icons/rx";
import { MdMenuBook } from "react-icons/md";
import {  CheckCircle2, Eye,GlobeLock,Loader,Settings,Trash,LaptopMinimal,EyeOff } from 'lucide-react';

const icons = {
    search: CiSearch,
    trash: FaTrashAlt,
    eye: Eye,
    settings: Settings,
    right: FaArrowRight,
    pen: FaPen,
    back: IoIosArrowBack,
    world: BiWorld,
    clock: FaClock,
    users: FaUsers,
    medal: FaMedal,
    info: CiCircleInfo,
    bullseye: FaBullseye,
    bookOpen: FaBookOpen,
    boxOpen: FaBoxOpen,
    upload: FaUpload,
    bookmark: FaBookmark,
    plus: FaPlus,
    trashAlt: Trash,
    cross: ImCross,
    trash2: FiTrash2,
    download: FiDownload,
    restore:HiRefresh,
    file:GoFileDirectoryFill,
    cross2:RxCross2,
    star:FaRegStar,
    support:MdMenuBook,
    private:GlobeLock,
    inPreparation:Loader,
    isActive:CheckCircle2,
    laptop:LaptopMinimal,
    masque : EyeOff,
};

export default icons;