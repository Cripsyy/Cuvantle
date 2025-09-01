import React, { useState } from 'react';
import Progress from './Progress';
import ChartNavigation, { ChartOption as MenuOption } from './ChartNavigation';
import { useClickOutside } from '../utils/useClickOutside';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  isProgressiveMode?: boolean;
  progressiveLevel: number;
}

const HelpModal: React.FC<HelpModalProps> = ({ 
  isOpen, 
  onClose,
  isProgressiveMode = false,
  progressiveLevel
}) => {
  const MenuNavigation = ChartNavigation;
  const [currentMenu, setCurrentMenu] = useState<'normal' | 'progressive'>('normal');
  const { elementRef: modalRef, handleBackdropClick } = useClickOutside(onClose);

  const MenuOptions: MenuOption<'normal' | 'progressive'>[] = [
    { id: 'normal', title: 'Ajutor joc normal' },
    { id: 'progressive', title: 'Ajutor joc progresiv' }
  ];

  if (!isOpen) return null;

  return (
      <div 
        className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-50 md:items-center"
        onClick={handleBackdropClick}
      >
        <div 
          ref={modalRef}
          className="p-4 sm:p-6 flex flex-col justify-between w-full max-w-lg bg-white rounded-t-2xl md:rounded-lg shadow-lg dark:bg-gray-800 animate-slide-up md:animate-none md:mx-4 min-h-[75vh] overflow-y-auto"
        >
          {currentMenu === "normal" ?(
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-extrabold sm:text-xl md:text-2xl">Cum se joacă?</h2>
                <button
                    onClick={onClose}
                    className="p-1 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
              </div>
              <p className="mb-2 text-sm font-semibold text-gray-700 sm:mb-3 sm:text-base md:text-lg dark:text-gray-300">
                Ghicește cuvântul românesc de 3-9 litere în 6 încercări! 
              </p>
              <ul className="mb-2 ml-5 text-xs text-gray-700 list-disc sm:text-sm md:text-base dark:text-gray-300">
                <li>Scrie un cuvânt românesc de 3-9 litere în câmpul de text.</li>
                <li>Ai 6 încercări pentru a ghici cuvântul corect.</li>
                <li>Culorile se vor schimba pentru a-ți indica cât de aproape ești de cuvântul corect.</li>
              </ul>
              <div>
                <h2 className="mb-2 text-base font-extrabold sm:mb-3 sm:text-lg md:text-xl">Exemple:</h2>
                <div className='flex gap-1 mb-1'>
                  <div className='tile-sm tile-filled tile-correct animate-flip'>C</div>
                  <div className='tile-sm tile-filled'>A</div>
                  <div className='tile-sm tile-filled'>R</div>
                  <div className='tile-sm tile-filled'>T</div>
                  <div className='tile-sm tile-filled'>E</div>
                </div>
                <p className='mb-2 text-xs sm:text-sm md:text-base'><span className='font-extrabold'>C</span> se află in cuvânt și este pe poziția bună</p>
                <div className='flex gap-1 mb-1'>
                  <div className='tile-sm tile-filled'>M</div>
                  <div className='tile-sm tile-filled tile-present animate-flip'>U</div>
                  <div className='tile-sm tile-filled'>N</div>
                  <div className='tile-sm tile-filled'>C</div>
                  <div className='tile-sm tile-filled'>Ă</div>
                </div>
                <p className='mb-2 text-xs sm:text-sm md:text-base'><span className='font-extrabold'>U</span> se află in cuvânt, dar nu este pe poziția bună</p>
                <div className='flex gap-1 mb-1'>
                  <div className='tile-sm tile-filled'>U</div>
                  <div className='tile-sm tile-filled'>N</div>
                  <div className='tile-sm tile-filled'>G</div>
                  <div className='tile-sm tile-filled tile-absent animate-flip'>H</div>
                  <div className='tile-sm tile-filled'>I</div>
                </div>
                <p className='mb-2 text-xs sm:text-sm md:text-base'><span className='font-extrabold'>H</span> nu se află in cuvânt pe nicio poziție</p>
              </div>
              <hr className="my-4 border-gray-400 border-t-1 dark:border-gray-500" />
              <p className="text-xs sm:text-sm md:text-base">După 6 încercări, dacă nu ai ghicit cuvântul, acesta va fi dezvăluit.</p>
              <p className="text-xs sm:text-sm md:text-base">Indiferent dacă ai ghicit sau nu, poți începe o nouă rundă sau poți analiza jocul.</p>
            </>
          ):(
            <>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-extrabold sm:text-xl md:text-2xl">Cum se joacă?(Modul Progresiv)</h2>
                  <button
                      onClick={onClose}
                      className="p-1 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                  </button>
                </div>
                <p className="mb-2 text-sm font-semibold text-gray-700 sm:mb-3 sm:text-base md:text-lg dark:text-gray-300">
                  Progresează de la 3 la 9 litere cu 6 încercări fiecare!
                </p>
              </div>      
              <div>
                <h3 className="mb-2 text-base font-extrabold sm:mb-3 sm:text-lg md:text-xl">Cum funcționează progresul</h3>
                <p className="mb-2 text-xs text-gray-700 sm:text-sm md:text-base dark:text-gray-300">
                  În modul progresiv începi cu un cuvânt de 3 litere și treci la următorul nivel după ce
                  ghicești corect cuvântul. Fiecare nivel crește în lungimea cu o literă. Scopul este să ajungi la 9 litere ghicind toate cuvintele.
                </p>
              </div>
              <div>
                <h3 className="mb-2 text-base font-extrabold sm:mb-3 sm:text-lg md:text-xl">Cum avansezi</h3>
                <ul className="mb-3 ml-5 text-xs text-gray-700 list-disc sm:text-sm md:text-base dark:text-gray-300">
                  <li>Trebuie să ghicești cuvântul curent în maxim 6 încercări pentru a avansa.</li>
                  <li>Dacă nu reușești, trebuie sa reîncepi jocul de la un cuvânt de 3 litere.</li>
                  <li>Când ai terminat toate cuvintele, poți începe o nouă rundă.</li>
                </ul>
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-xs sm:text-sm md:text-base">
                  Progresul tău poate fi vizualizat in permanență pe bara de progres prin intermediul indicatorului de progres.
                  Fiecare culoare reprezintă dificultatea cuvântului.
                </p>
              </div>
              <div className="mb-4">
              <Progress
                progressiveLevel={progressiveLevel}
                />
              </div>
              <hr className="my-4 border-gray-400 border-t-1 dark:border-gray-500" />
              <p className="mb-2 text-xs text-gray-700 sm:text-sm md:text-base dark:text-gray-300">
                Regulile jocului normal se aplică. Progresul tău este salvat automat și poți continua jocul oricând.
              </p>
            </>
          )}
          {isProgressiveMode && (
            <MenuNavigation 
              chartOptions={MenuOptions}
              currentChart={currentMenu}
              onChartChange={setCurrentMenu}
              className="mt-6"
            />
          )}
        </div>
      </div>
  );
};

export default HelpModal;
