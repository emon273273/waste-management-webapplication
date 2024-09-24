"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "../ui/button";

import {
  Menu,
  Coins,
  Leaf,
  Search,
  Bell,
  User,
  ChevronDown,
  LogIn,
  LogOut,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Badge } from "@/components/ui/badge";

//auth
import {
  CHAIN_NAMESPACES,
  IAdapter,
  IProvider,
  WEB3AUTH_NETWORK,
} from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { Web3Auth, Web3AuthOptions } from "@web3auth/modal";
import {
  createUser,
  getUnreadNotification,
  getUserByEmail,
} from "@/utils/db/actions";

const clientId = process.env.WEB3_AUTH_CLIENT_ID;

const chainConfig = {
  ChainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0xaa36a7",
  rpcTarget: "https://rpc.ankr.com/eth_sepolia",
  displayName: "Ethereum Sepolia Testnet",
  blockExplorerUrl: "https://sepolia.etherscan.io",
  ticker: "ETH",
  tickerName: "Ethereum",
  logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
};

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: chainConfig,
});

const web3Auth = new Web3Auth({
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.TESTNET,
  privateKeyProvider,
});

interface HeaderProps {
  onMenuClick: () => void;
  totalEarning: number;
}

export default function Header({ onMenuClick, totalEarning }: HeaderProps) {
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const [userInfo, setUserInfo] = useState<any>(null);

  const pathname = usePathname();
  const [notification, setNotification] = useState<Notification[]>([]);
  const [balance, setBalance] = useState(0);

  //initializes Web3Auth and sets the provider, checking if the user is connected and logged in.
  useEffect(() => {
    const init = async () => {
      try {
        await web3Auth.initModal();
        setProvider(web3Auth.provider);

        if (web3Auth.connected) {
          setLoggedIn(true);
          const user = await web3Auth.getUserInfo();
          setUserInfo(user);
          if (user.email) {
            localStorage.setItem("userEmail", user.email);
            await createUser(user.email, user.name || "anonymous user");
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  //unread notifications when the user is logged in (via their email). This runs every 30 seconds to check for new notifications.

  useEffect(() => {
    const fetchNotification = async () => {
      if (userInfo && userInfo.email) {
        const user = await getUserByEmail(userInfo.email);

        if (user) {
          const unreadNotifications = await getUnreadNotification(user.id);
          setNotification(unreadNotifications);
        }
      }
    };

    fetchNotification();

    //periodic checking for new notifications

    const notificationInterval = setInterval(fetchNotification, 30000);

    return () => clearInterval(notificationInterval);
  }, [userInfo]);


  //create a useeffect for fetch the user balance

  useEffect(()=>{

    const fetchUserBalance=async()=>{
      if(userInfo && userInfo.email){
        const user=await getUserByEmail(userInfo.email)

        if(user){

          const userBalance
        }
      }
    }
  })

}
