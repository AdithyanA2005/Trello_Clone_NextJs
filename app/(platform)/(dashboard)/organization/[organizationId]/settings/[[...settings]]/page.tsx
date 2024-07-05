import { OrganizationProfile } from "@clerk/nextjs";

export default function SettingsPage() {
  return (
    <OrganizationProfile
      appearance={{
        elements: {
          rootBox: {
            width: "100%",
          },
          navbar: {
            background: "white",
          },
          navbarButton: {
            color: "black",
            opacity: 0.7,
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.07)",
            },
          },
          navbarButton__active: {
            opacity: 1,
            backgroundColor: "rgba(0, 0, 0, 0.07)",
          },
          navbarButtonIcon: {
            opacity: 1,
          },
          cardBox: {
            boxShadow: "none",
            width: "100%",
            border: "1px solid #e5e5e5",
          },
          scrollBox: {
            boxShadow: "none",
            borderRadius: 0,
            borderLeftWidth: 1,
            borderStyle: "solid",
            borderColor: "#e5e5e5",
          },
        },
      }}
    />
  );
}
