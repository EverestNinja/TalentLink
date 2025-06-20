import React from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Container,
  CardActions,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

// The data is now the single source of truth for all styling and content.
const userPlans = [
  {
    id: "free_plan",
    name: "Free Plan",
    description: "For individuals getting started",
    price: "Free",
    features: [
      "Apply 5 jobs a month",
      "Basic profile",
      "Basic mentors matchmaking",
      "Access to feed",
    ],
    buttonText: "Start for Free",
    themeColor: "inherit",
    isPopular: false,
  },
  {
    id: "pro_plan",
    name: "TalentLink Pro",
    description: "For professionals boosting their career",
    price: "$9.99",
    pricePeriod: "/month",
    features: [
      "Apply unlimited jobs",
      "Advanced profile",
      "Priority support",
      "Post in feed",
    ],
    buttonText: "Subscribe Now",
    themeColor: "pimary",
    isPopular: true, // This flag drives the "Most Popular" badge and special styling
  },
  {
    id: "premium_plan",
    name: "TalentLink Premium",
    description: "For those who want it all",
    price: "$19.99",
    pricePeriod: "/month",
    features: [
      "All Pro features",
      "1-1 mentorship sessions",
      "Direct job referrals",
      "Premium profile badge",
    ],
    buttonText: "Go Premium",
    themeColor: "inherit",
    isPopular: false,
  },
];

const UserPlans = () => {
  return (
    <>
      <section className="lg:px-12 sm:px-8 x-sm:px-4 py-28 flex justify-center items-center bg-gradient-to-r from-[#b263fc] to-[#8929e2] pb-12">
        <h1 className="md:text-[5rem] sm:text-[6rem] x-sm:text-[3rem] font-bold text-white text-center leading-22">
          Start Free, Upgrade <br /> As You Grow
        </h1>
      </section>
      <Box sx={{ backgroundColor: "", pt: 8, mt: 1, mb: 12 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            align="center"
            fontWeight="bold"
            gutterBottom
          >
            Flexible Plans for Everyone
          </Typography>
          <Typography
            variant="h6"
            align="center"
            className="!text-[16px]"
            color="text.secondary"
            sx={{ mb: 6 }}
          >
            Choose the plan that's right for you. Unlock your potential with
            TalentLink.
          </Typography>

          {/* Use `alignItems="flex-end"` to align the bottom of the cards, which is great if they have different content lengths */}
          <Grid
            container
            spacing={4}
            alignItems="flex-end"
            justifyContent="center"
          >
            {userPlans.map((plan) => (
              <Grid item xs={12} sm={6} md={4} key={plan.id}>
                <Card
                  sx={{
                    position: "relative",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    border: plan.isPopular ? "2px solid" : "1px solid",
                    borderColor: plan.isPopular ? "#8929e2" : "grey.300",
                    transform: plan.isPopular ? "scale(1.05)" : "none",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    zIndex: plan.isPopular ? 1 : 0,
                    boxShadow: plan.isPopular ? 10 : 3,
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: 10,
                    },
                  }}
                >
                  {plan.isPopular && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        backgroundColor: "#8929e2",
                        color: "primary.contrastText",
                        px: 2,
                        py: 0.5,
                        my: 1.2,
                        width: "50%",
                        borderRadius: "16px",
                        typography: "caption",
                        fontWeight: "bold",
                      }}
                    >
                      MOST POPULAR
                    </Box>
                  )}

                  <CardContent sx={{ pt: 5, flexGrow: 1 }}>
                    <Typography
                      variant="h5"
                      align="center"
                      fontWeight="bold"
                      gutterBottom
                    >
                      {plan.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      align="center"
                      color="text.secondary"
                      sx={{ minHeight: "40px", mb: 2 }}
                    >
                      {plan.description}
                    </Typography>
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="baseline"
                      my={2}
                    >
                      <Typography variant="h3" fontWeight="bold">
                        {plan.price}
                      </Typography>
                      {plan.pricePeriod && (
                        <Typography variant="h6" color="text.secondary">
                          {plan.pricePeriod}
                        </Typography>
                      )}
                    </Box>
                    <List dense>
                      {plan.features.map((feature, idx) => (
                        <ListItem key={idx} disableGutters>
                          <ListItemIcon sx={{ minWidth: "32px" }}>
                            <CheckCircleIcon
                              sx={{
                                color:
                                  plan.themeColor === "inherit"
                                    ? "text.secondary"
                                    : plan.themeColor === "primary"
                                    ? "primary.main"
                                    : plan.themeColor === "secondary"
                                    ? "secondary.main"
                                    : "#8929e2",
                              }}
                              fontSize="small"
                            />
                          </ListItemIcon>
                          <ListItemText primary={feature} />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>

                  <CardActions sx={{ p: 3, pt: 0 }}>
                    <Button
                      fullWidth
                      variant={plan.isPopular ? "contained" : "outlined"}
                      className={`${plan.isPopular ? "!bg-[#8929e2]" : ""}`}
                      size="large"
                    >
                      {plan.buttonText}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default UserPlans;
