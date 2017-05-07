import ConfigManager from './ConfigManager';
import DataManager from './DataManager';
import LocalesManager from './LocalesManager';
import SoundManager from './SoundManager';
import StatusManager from './StatusManager';
import TickerManager from './TickerManager';

const managers = {
  Data,
  Locales,
  Sound,
  Status,
  Ticker,
};

export default managers;

export {
  ConfigManager,
  DataManager,
  LocalesManager,
  SoundManager,
  StatusManager,
  TickerManager,
}
