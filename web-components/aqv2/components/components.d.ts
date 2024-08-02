import { AqAudio } from './audio';
import { AqCodeblock } from './code';
import AqConsole from './console';
import { AqDetails } from './details';
import { AqIcon } from './icon';
import { AqInputNumber } from './input-number';
import { AqMiniCard } from './minicard';
import { AqSlider } from './slider';
import { AqSnackbar } from './snackbar';
import { AqTab, AqTabLabel, AqTabPanel } from './tab';
import { AqTooltip } from './tooltip';
import { AqTranslate } from './translate';
import AqWindow from './window';

export interface AquamarineComponentTagNameMap {
    'aq-audio': AqAudio;
    'aq-code': AqCodeblock;
    'aq-console': AqConsole;
    'aq-details': AqDetails;
    'aq-icon': AqIcon;
    'aq-input-number': AqInputNumber;
    'aq-minicard': AqMiniCard;
    'aq-slider': AqSlider;
    'aq-snackbar': AqSnackbar;
    'aq-tab': AqTab;
    'aq-tab-label': AqTabLabel;
    'aq-tab-panel': AqTabPanel;
    'aq-tooltip': AqTooltip;
    'aq-translate': AqTranslate;
    'aq-window': AqWindow;
}
