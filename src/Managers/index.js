import ConfigManager from './ConfigManager';
import DataManager from './DataManager';
import LocalesManager from './LocalesManager';
import SoundManager from './SoundManager';
import StatusManager from './StatusManager';
import TickerManager from './TickerManager';

const managers = {
  Config: ConfigManager,
  Data: DataManager,
  Locales: LocalesManager,
  Sound: SoundManager,
  Status: StatusManager,
  Ticker: TickerManager,
};

export default managers;

export {
  ConfigManager,
  DataManager,
  LocalesManager,
  SoundManager,
  StatusManager,
  TickerManager,
};
