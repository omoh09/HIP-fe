import { getMarketSettings } from '../../actions';
import MarketSettingsClient from './market-settings-client';

export default async function MarketSettingsPage() {
  let data: any = null;
  try {
    data = (await getMarketSettings())?.data ?? null;
  } catch {}
  return <MarketSettingsClient initialData={data} />;
}
