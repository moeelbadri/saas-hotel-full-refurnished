"use client";

import { HiOutlineMoon, HiOutlineSun } from "react-icons/hi2";
import { HiOutlineTranslate,HiTranslate } from "react-icons/hi";
import { ButtonIcon } from "@/components/ui";
import {useLocalStorageState,useLanguageMode,directionStore} from '@/hooks';
import { useSettingsStore } from "@/components/WizardForm/useStore";
import { useEffect } from "react";
import { shallow } from 'zustand/shallow';

function LanguageToggle() {
    const { isRtl, toggleDirection } = useLanguageMode();
    const Language = useSettingsStore(state => state.Language);
    const setlanguage = useSettingsStore(state => state.setlanguage);
    // const [used, setUsed] = useLocalStorageState('used', 'usedlanguagePreference');
    const { direction, setDirection } = directionStore(isRtl===true?'rtl':'ltr');

    useEffect(() => {
        setlanguage(isRtl === false ? 'en' : 'ar');
    }, [isRtl,direction]);

    
    const toggleDirection1 = () => {
        // setDirection(direction === 'ltr' ? 'rtl' : 'ltr');
        // setLanguage(isRtl === true ? 'rtl' : 'ltr');
        setlanguage(isRtl === false ? 'en' : 'ar');
        toggleDirection();
      };
    
    return (
        <ButtonIcon onClick={toggleDirection1}>
            {/* {direction==='ltr' ? <HiOutlineTranslate /> : <HiTranslate />} */}
            {isRtl===false ? <HiOutlineTranslate /> : <HiTranslate />}
        </ButtonIcon>
    );
}

export default LanguageToggle;
