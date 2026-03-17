import React from 'react';
import { UserProvider } from './useUserStore';
import { WalletProvider } from './useWalletStore';
import { ActiveRequestProvider } from './useActiveRequestStore';
import { RequestProvider } from './useRequestStore';
import { TopUpProvider } from './useTopUpStore';
import { ActivityProvider } from './useActivityStore';
import { ProofOfServiceProvider } from './useProofOfServiceStore';
import { TransactionProvider } from './useTransactionStore';
import { SupportProvider } from './useSupportStore';
import { HeaderProvider } from './useHeaderStore';
import { ProfileProvider } from './useProfileStore';

/**
 * AppProvider - Combines all store providers
 * Wrap your app with this to have access to all stores
 * 
 * @example
 * import { AppProvider } from '@/stores';
 * 
 * export default function App() {
 *   return (
 *     <AppProvider>
 *       <YourApp />
 *     </AppProvider>
 *   );
 * }
 */
export function AppProvider({ children }) {
  return (
    <UserProvider>
      <WalletProvider>
        <ActiveRequestProvider>
          <RequestProvider>
            <TopUpProvider>
              <ActivityProvider>
                <ProofOfServiceProvider>
                  <TransactionProvider>
                    <SupportProvider>
                      <HeaderProvider>
                        <ProfileProvider>
                          {children}
                        </ProfileProvider>
                      </HeaderProvider>
                    </SupportProvider>
                  </TransactionProvider>
                </ProofOfServiceProvider>
              </ActivityProvider>
            </TopUpProvider>
          </RequestProvider>
        </ActiveRequestProvider>
      </WalletProvider>
    </UserProvider>
  );
}
