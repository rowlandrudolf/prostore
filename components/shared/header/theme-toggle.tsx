'use client';
import { Button } from "@/components/ui/button";
import {
    DropdownMenu, 
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator, 
    DropdownMenuContent,
    DropdownMenuCheckboxItem
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { useState, useEffect} from 'react'
import { SunIcon, MoonIcon, SunMoon} from 'lucide-react'

const ThemeToggle = () => {
    const { theme, setTheme } = useTheme();
    const [ mounted, setMounted ] = useState(false);

    useEffect(() => {
        setMounted(true);
    },[])

    if(!mounted){
        return null
    }

    const renderIcon = () => {
        switch(theme){
            case 'system':
                return <SunMoon/>
            case 'light': 
                return <SunIcon/>
            case 'dark':
                return <MoonIcon/>
        }
    }

    return <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant={'ghost'}>
                {renderIcon()}
            </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
            <DropdownMenuLabel>Appearance</DropdownMenuLabel>
            <DropdownMenuSeparator/>
            <DropdownMenuCheckboxItem 
                checked={ theme === 'system'} 
                onClick={() => setTheme('system')}>
                System
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem 
                checked={ theme === 'light'} 
                onClick={() => setTheme('light')}>
                Light
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem 
                checked={ theme === 'dark'} 
                onClick={() => setTheme('dark')}>
                Dark
            </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
    </DropdownMenu>
    ;
}
 
export default ThemeToggle;