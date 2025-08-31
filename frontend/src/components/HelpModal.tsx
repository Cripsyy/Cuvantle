import React, { useState } from 'react';
import Progress from './Progress';
import ChartNavigation, { ChartOption as MenuOption } from './ChartNavigation';

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

  const MenuOptions: MenuOption<'normal' | 'progressive'>[] = [
    { id: 'normal', title: 'Ajutor joc normal' },
    { id: 'progressive', title: 'Ajutor joc progresiv' }
  ];

  if (!isOpen) return null;

  return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="flex flex-col justify-between w-full h-full max-w-lg max-h-[70vh] p-6 mx-4 bg-white rounded-lg shadow-lg dark:bg-gray-800">
          {currentMenu === "normal" ?(
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-extrabold">Cum se joacă?</h2>
                <button
                    onClick={onClose}
                    className="p-1 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
              </div>
              <p className="mb-3 text-lg font-semibold text-gray-700 dark:text-gray-300">
                Ghicește cuvântul românesc de 3-9 litere în 6 încercări! 
              </p>
              <ul className="mb-2 ml-5 text-gray-700 list-disc dark:text-gray-300">
                <li>Scrie un cuvânt românesc de 3-9 litere în câmpul de text.</li>
                <li>Ai 6 încercări pentru a ghici cuvântul corect.</li>
                <li>Culorile se vor schimba pentru a-ți indica cât de aproape ești de cuvântul corect.</li>
              </ul>
              <div>
                <h2 className="mb-3 text-xl font-extrabold">Exemple:</h2>
                <div className='flex gap-1 mb-1'>
                  <div className='tile-sm tile-filled tile-correct animate-flip'>C</div>
                  <div className='tile-sm tile-filled'>A</div>
                  <div className='tile-sm tile-filled'>R</div>
                  <div className='tile-sm tile-filled'>T</div>
                  <div className='tile-sm tile-filled'>E</div>
                </div>
                <p className='mb-2'><span className='font-extrabold'>C</span> se află in cuvânt și este pe poziția bună</p>
                <div className='flex gap-1 mb-1'>
                  <div className='tile-sm tile-filled'>M</div>
                  <div className='tile-sm tile-filled tile-present animate-flip'>U</div>
                  <div className='tile-sm tile-filled'>N</div>
                  <div className='tile-sm tile-filled'>C</div>
                  <div className='tile-sm tile-filled'>Ă</div>
                </div>
                <p className='mb-2'><span className='font-extrabold'>U</span> se află in cuvânt, dar nu este pe poziția bună</p>
                <div className='flex gap-1 mb-1'>
                  <div className='tile-sm tile-filled'>U</div>
                  <div className='tile-sm tile-filled'>N</div>
                  <div className='tile-sm tile-filled'>G</div>
                  <div className='tile-sm tile-filled tile-absent animate-flip'>H</div>
                  <div className='tile-sm tile-filled'>I</div>
                </div>
                <p className='mb-2'><span className='font-extrabold'>H</span> nu se află in cuvânt pe nicio poziție</p>
              </div>
              <hr className="my-4 border-gray-400 border-t-1 dark:border-gray-500" />
              <p>După 6 încercări, dacă nu ai ghicit cuvântul, acesta va fi dezvăluit.</p>
              <p>Indiferent dacă ai ghicit sau nu, poți începe o nouă rundă sau poți analiza jocul.</p>
            </>
          ):(
            <>
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-extrabold">Cum se joacă?(Modul Progresiv)</h2>
                  <button
                      onClick={onClose}
                      className="p-1 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                  </button>
                </div>
                <p className="mb-3 text-lg font-semibold text-gray-700 dark:text-gray-300">
                  Progresează de la 3 la 9 litere cu 6 încercări fiecare!
                </p>
              </div>      
              <div>
                <h3 className="mb-3 text-xl font-extrabold">Cum funcționează progresul</h3>
                <p className="mb-2 text-sm text-gray-700 dark:text-gray-300">
                  În modul progresiv începi cu un cuvânt de 3 litere și treci la următorul nivel după ce
                  ghicești corect cuvântul. Fiecare nivel crește în lungimea cu o literă. Scopul este să ajungi la 9 litere ghicind toate cuvintele.
                </p>
              </div>
              <div>
                <h3 className="mb-3 text-xl font-extrabold">Cum avansezi</h3>
                <ul className="mb-3 ml-5 text-gray-700 list-disc dark:text-gray-300">
                  <li>Trebuie să ghicești cuvântul curent în maxim 6 încercări pentru a avansa.</li>
                  <li>Dacă nu reușești, trebuie sa reîncepi jocul de la un cuvânt de 3 litere.</li>
                  <li>Când ai terminat toate cuvintele, poți începe o nouă rundă.</li>
                </ul>
              </div>
              <div className="flex flex-col justify-center">
                <p>
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
              <p className="mb-2 text-gray-700 dark:text-gray-300">
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
