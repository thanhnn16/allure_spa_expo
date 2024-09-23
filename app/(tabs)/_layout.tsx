import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Tabs } from "expo-router";

export default function TabLayout() {
    return (
        <Tabs screenOptions={{ headerShown: false }}>
            <Tabs.Screen
                name="(home)"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="StorePage"
                options={{
                    title: 'StorePage',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'storefront' : 'storefront-outline'} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="ScheduledPage"
                options={{
                    title: 'SchedulePage',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'calendar' : 'calendar-outline'} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="ProfilePage"
                options={{
                    title: 'ProfilePage',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'person' : 'person-outline'} color={color} />
                    ),
                }}
            />
        </Tabs>
    )
}