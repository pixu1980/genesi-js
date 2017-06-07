import ConfigManager from './ConfigManager';
import EnvironmentManager from './EnvironmentManager';
import AssetsManager from './AssetsManager';
import LocalesManager from './LocalesManager';
import SoundsManager from './SoundsManager';
import StatusManager from './StatusManager';
import TickerManager from './TickerManager';

const managers = {
  Config: ConfigManager,
  Environment: EnvironmentManager,
  Assets: AssetsManager,
  Locales: LocalesManager,
  Sounds: SoundsManager,
  Status: StatusManager,
  Ticker: TickerManager,
};

export default managers;

export {
  ConfigManager,
  EnvironmentManager,
  AssetsManager,
  LocalesManager,
  SoundsManager,
  StatusManager,
  TickerManager,
};
