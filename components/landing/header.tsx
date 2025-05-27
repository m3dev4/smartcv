import React, { useEffect, useState } from 'react';
import { Languages, MoonStar, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import Image from 'next/image';

const Header = () => {
    const { setTheme } = useTheme();
    const [toggleMode, setToggleMode] = useState(false);

    useEffect(() => {
        if (toggleMode) {
            setTheme('dark');
        } else {
            setTheme('light');
        }
    }, [toggleMode]);

    const handleToggle = () => {
        setToggleMode(!toggleMode);
    };

    return (
        <header className=" w-full flex sticky top-0 left-0 z-10 bg-background-transparent backdrop-blur shadow-sm">
            <div className="flex w-full items-center">
                <div className="p-4 flex justify-center items-center gap-4">
                    <span>Smart CV</span>
                    <Languages size={20} />
                    {toggleMode ? (
                        <Sun
                            size={20}
                            onClick={handleToggle}
                            className="transition ease-in duration-300"
                        />
                    ) : (
                        <MoonStar size={20} onClick={handleToggle} />
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
