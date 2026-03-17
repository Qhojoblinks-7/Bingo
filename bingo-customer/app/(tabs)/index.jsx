import React, { useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, RefreshControl } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { BinGoHeader } from "@/components/BinGoHeader";
import { BinGoButton } from "@/components/BinGoButton";
import { SuccessModal } from "@/components/SuccessModal";
import { useColors } from "@/hooks/useColors";
import { useUserStore, useWalletStore, useActiveRequestStore } from "@/stores";

export default function Home() {
  const router = useRouter();
  const colors = useColors();
  const [showInsufficientFunds, setShowInsufficientFunds] =
    React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  // Use stores
  const { name, lastPickup } = useUserStore();
  const { balance, hasSufficientBalance, minimumPickupPrice } =
    useWalletStore();
  const { currentRequest, hasActiveRequest } = useActiveRequestStore();

  // Handle pull-to-refresh
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    // Simulate refresh - in production, this would fetch fresh data
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  }, []);

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const handleRequestNow = () => {
    // Check if there's an active request
    if (hasActiveRequest) {
      // Navigate to view current job
      router.push(`/activity/${currentRequest.id}`);
      return;
    }

    // Check balance before proceeding
    if (!hasSufficientBalance) {
      // Show insufficient funds message
      setShowInsufficientFunds(true);
      return;
    }

    // Proceed to request screen
    router.push("/request");
  };

  const handleTopUp = () => {
    router.push("/topup");
  };

  const handleViewJob = () => {
    if (hasActiveRequest && currentRequest) {
      router.push(`/activity/${currentRequest.id}`);
    }
  };

  const handleCallRider = () => {
    // Would open dialer with rider's number
    console.log("Call rider");
  };

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: colors.background,
        },
        content: {
          padding: 20,
        },
        welcomeSection: {
          marginBottom: 24,
        },
        greeting: {
          fontSize: 24,
          fontWeight: "800",
          color: colors.text,
        },
        subGreeting: {
          fontSize: 14,
          color: colors.muted,
          marginTop: 4,
        },
        activeJobCard: {
          backgroundColor: colors.card,
          borderRadius: 20,
          padding: 20,
          marginBottom: 20,
          borderWidth: 1,
          borderColor: colors.primary,
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 3,
        },
        activeJobHeader: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        },
        activeJobBadge: {
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
          backgroundColor: colors.primary,
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 20,
        },
        activeJobBadgeText: {
          color: colors.white,
          fontSize: 12,
          fontWeight: "700",
        },
        activeJobEta: {
          fontSize: 14,
          fontWeight: "600",
          color: colors.primary,
        },
        activeJobTitle: {
          fontSize: 18,
          fontWeight: "800",
          color: colors.text,
          marginBottom: 4,
        },
        activeJobRider: {
          fontSize: 14,
          color: colors.muted,
          marginBottom: 16,
        },
        activeJobActions: {
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
        },
        viewJobButton: {
          flex: 1,
          backgroundColor: colors.primary,
          paddingVertical: 12,
          borderRadius: 12,
          alignItems: "center",
        },
        viewJobText: {
          color: colors.white,
          fontSize: 14,
          fontWeight: "700",
        },
        callRiderButton: {
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: colors.primary + "15",
          justifyContent: "center",
          alignItems: "center",
          borderWidth: 1,
          borderColor: colors.primary,
        },
        walletCard: {
          backgroundColor: colors.card,
          borderRadius: 20,
          padding: 20,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
          borderWidth: 1,
          borderColor: colors.border,
        },
        walletLabel: {
          fontSize: 12,
          color: colors.muted,
          fontWeight: "600",
          textTransform: "uppercase",
        },
        walletAmount: {
          fontSize: 28,
          fontWeight: "800",
          color: colors.text,
          marginTop: 4,
        },
        lowBalanceHint: {
          fontSize: 12,
          color: colors.error,
          fontWeight: "500",
          marginTop: 4,
        },
        topupHint: {
          fontSize: 12,
          color: colors.primary,
          fontWeight: "500",
          marginTop: 4,
        },
        walletIcon: {
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: colors.primary + "15",
          justifyContent: "center",
          alignItems: "center",
        },
        walletIconWarning: {
          backgroundColor: colors.error + "20",
        },
        actionSection: {
          backgroundColor: colors.card,
          borderRadius: 24,
          padding: 30,
          alignItems: "center",
          borderWidth: 1,
          borderColor: colors.border,
        },
        iconCircle: {
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: colors.primary + "15",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 16,
        },
        actionTitle: {
          fontSize: 20,
          fontWeight: "700",
          color: colors.text,
        },
        actionDesc: {
          fontSize: 14,
          color: colors.muted,
          textAlign: "center",
          marginTop: 8,
          marginBottom: 24,
          lineHeight: 20,
        },
        statsContainer: {
          marginTop: 20,
          alignItems: "center",
        },
        statBox: {
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
        },
        statText: {
          color: colors.muted,
          fontSize: 13,
          fontWeight: "500",
        },
      }),
    [colors],
  );

  return (
    <View style={styles.container}>
      <BinGoHeader title="BinGo" />

      <ScrollView 
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.greeting}>
            {getGreeting()}, {name}
          </Text>
          <Text style={styles.subGreeting}>
            Keep your environment clean today.
          </Text>
        </View>

        {/* Active Job Status Card - Shows when there's an active request */}
        {hasActiveRequest && currentRequest && (
          <View style={styles.activeJobCard}>
            <View style={styles.activeJobHeader}>
              <View style={styles.activeJobBadge}>
                <Ionicons name="car-sport" size={16} color={colors.white} />
                <Text style={styles.activeJobBadgeText}>Active Pickup</Text>
              </View>
              <Text style={styles.activeJobEta}>
                {currentRequest.eta || "Arriving soon"}
              </Text>
            </View>

            <Text style={styles.activeJobTitle}>Your rider is on the way</Text>
            <Text style={styles.activeJobRider}>
              Rider: {currentRequest.rider || "Assigned"}
            </Text>

            <View style={styles.activeJobActions}>
              <Pressable style={styles.viewJobButton} onPress={handleViewJob}>
                <Text style={styles.viewJobText}>View Details</Text>
              </Pressable>
              <Pressable
                style={styles.callRiderButton}
                onPress={handleCallRider}
              >
                <Ionicons name="call" size={18} color={colors.primary} />
              </Pressable>
            </View>
          </View>
        )}

        {/* Wallet Card - Clickable for Top Up */}
        <Pressable onPress={handleTopUp} style={styles.walletCard}>
          <View>
            <Text style={styles.walletLabel}>Available Balance</Text>
            <Text style={styles.walletAmount}>GH₵ {balance}</Text>
            {!hasSufficientBalance && (
              <Text style={styles.lowBalanceHint}>
                Low balance - Tap to top up
              </Text>
            )}
            {hasSufficientBalance && (
              <Text style={styles.topupHint}>+ Tap to top up</Text>
            )}
          </View>
          <View
            style={[
              styles.walletIcon,
              !hasSufficientBalance && styles.walletIconWarning,
            ]}
          >
            <Ionicons name="wallet" size={32} color={colors.primary} />
          </View>
        </Pressable>

        {/* Primary Action */}
        <View style={styles.actionSection}>
          <View style={styles.iconCircle}>
            <Ionicons name="trash" size={40} color={colors.primary} />
          </View>
          <Text style={styles.actionTitle}>
            {hasActiveRequest ? "Pickup In Progress" : "Need a pickup?"}
          </Text>
          <Text style={styles.actionDesc}>
            {hasActiveRequest
              ? "Track your current pickup in real-time."
              : "Request a rider to clear your waste instantly."}
          </Text>
          <BinGoButton
            title={hasActiveRequest ? "View Current Job" : "Request Now"}
            onPress={handleRequestNow}
          />
        </View>

        {/* Recent Activity Mini-Card */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Ionicons name="time" size={20} color={colors.muted} />
            <Text style={styles.statText}>Last: {lastPickup}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Insufficient Funds Modal */}
      <SuccessModal
        visible={showInsufficientFunds}
        onClose={() => setShowInsufficientFunds(false)}
        title="Insufficient Balance"
        message={`Your balance (GH₵ ${balance}) is too low for a pickup (minimum GH₵ ${minimumPickupPrice}). Would you like to top up your wallet?`}
      />
    </View>
  );
}
