import { createClient, Session } from "@supabase/supabase-js";
import { Notyf } from "notyf";

const supabase = createClient(
  "https://omitabgbgmawzzswespr.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9taXRhYmdiZ21hd3p6c3dlc3ByIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyMjAyMTY4OSwiZXhwIjoyMDM3NTk3Njg5fQ.bh6DZZbeq_xTA_px6nc5irbE95o2QhYChYy2u6rA-xc"
);

var notyf = new Notyf();

let email: string | undefined;

const removeUselessText = (flights: string) => {
  return flights.replaceAll(
    `This e-mail and any files and attachments transmitted with it
are confidential and may be legally privileged. They are intended
solely for the use of the intended recipient. Any views and
opinions expressed are those of the individual author/sender
and are not necessarily shared or endorsed by Ryanair Holdings plc
or any associated or related company. In particular e-mail
transmissions are not binding for the purposes of forming
a contract to sell airline seats, directly or via promotions,
and do not form a contractual obligation of any type.
Such contracts can only be formed in writing by post or fax,
duly signed by a senior company executive, subject to approval
by the Board of Directors.

The content of this e-mail or any file or attachment transmitted
with it may have been changed or altered without the consent
of the author. If you are not the intended recipient of this e-mail,
you are hereby notified that any review, dissemination, disclosure,
alteration, printing, circulation or transmission of, or any
action taken or omitted in reliance on this e-mail or any file
or attachment transmitted with it is prohibited and may be unlawful.

If you have received this e-mail in error
please notify Ryanair Holdings plc by contacting
Ryanair Holdings plc (Company No. 249885) / Ryanair DAC. (Company No. 104547).
Registered in the Republic Of Ireland. Airside Business Park, Swords, Co Dublin, Ireland.`,
    ""
  );
};

window.addEventListener("message", async (event) => {
  const access_token = event.data?.access_token;
  const refresh_token = event.data?.refresh_token;

  if (access_token && refresh_token) {
    const response = await supabase.auth.setSession({
      access_token,
      refresh_token,
    });
    console.log(response.data.user);
  }
});

supabase.auth.onAuthStateChange((_, session) => {
  if (session) {
    hideLoginForm();
    hideLoader();
    showUserInfo(session);
    toggleSubmitButton(false);
  } else {
    hideLoader();
    hideUserInfo();
    showLoginForm();
    toggleSubmitButton(true);
  }
});

const toggleSubmitButton = (disabled: boolean) => {
  const submitButton =
    document.querySelector<HTMLButtonElement>(".submit__flights");
  if (submitButton) {
    submitButton.disabled = disabled;
  }
};

const hideLoader = () => {
  const loader = document.querySelector<HTMLElement>(".auth__loader");
  if (loader) loader.style.display = "none";
};

const hideLoginForm = () => {
  const form = document.querySelector<HTMLElement>(".signin__form");
  if (form) form.style.display = "none";
};

const hideUserInfo = () => {
  const userInfo = document.querySelector<HTMLElement>(".user__info");
  if (userInfo) userInfo.style.display = "none";
};

const showUserInfo = async (session: Session) => {
  const userInfo = document.querySelector<HTMLElement>(".user__info");
  if (userInfo) {
    userInfo.style.display = "flex";

    document.querySelector<HTMLHeadingElement>(".email")!.innerText =
      session.user?.email ?? "";

    const { data: profile } = await supabase
      .from("objects")
      .select("data")
      .eq("table", "pilots")
      .eq("id", session.user.id)
      .maybeSingle();

    document.querySelector<HTMLHeadingElement>(".name")!.innerText =
      (profile as any)?.data?.full_name ?? "";
  }
};

const showLoginForm = () => {
  const form = document.querySelector<HTMLElement>(".signin__form");
  if (form) {
    form.style.display = "flex";
  }
};

const showOtpForm = () => {
  const form = document.querySelector<HTMLElement>(".otp__form");
  if (form) {
    form.style.display = "flex";
  }
};

const hideOtpForm = () => {
  const form = document.querySelector<HTMLElement>(".otp__form");
  if (form) {
    form.style.display = "none";
  }
};

const addEventListeners = (_: any) => {
  const emailButton =
    document.querySelector<HTMLButtonElement>(".email__signin");
  const googleButton =
    document.querySelector<HTMLButtonElement>(".google__signin");
  const appleButton =
    document.querySelector<HTMLButtonElement>(".apple__signin");
  const signOutButton =
    document.querySelector<HTMLButtonElement>(".signout__button");
  const emailInput = document.querySelector<HTMLInputElement>(".email__input");
  const returnLogin =
    document.querySelector<HTMLButtonElement>(".return__login");
  const otpInput = document.querySelector<HTMLInputElement>(".otp__input");
  const otpValidate =
    document.querySelector<HTMLButtonElement>(".otp__validate");

  const submitFlights =
    document.querySelector<HTMLButtonElement>(".submit__flights");

  otpValidate?.addEventListener("click", async () => {
    const otp = otpInput?.value;

    if (otp && otp.length === 6 && email) {
      const { error } = await supabase.auth.verifyOtp({
        email: email,
        token: otp,
        type: "email",
      });

      if (error) {
        notyf.error(error.message);
      } else {
        hideOtpForm();
      }
    } else {
      notyf.error("A valid code is required");
    }
  });

  returnLogin?.addEventListener("click", () => {
    hideOtpForm();
    showLoginForm();
  });

  emailButton?.addEventListener("click", async () => {
    email = emailInput?.value;

    function validateEmail(email: string) {
      var re = /\S+@\S+\.\S+/;
      return re.test(email);
    }

    if (email && emailInput) {
      if (!validateEmail(email)) {
        notyf.error("A valid email is required.");
        return;
      }

      hideLoginForm();
      showOtpForm();

      const { error } = await supabase.auth.signInWithOtp({ email: email });
      if (error) {
        notyf.error(error.message);
        hideOtpForm();
        showLoginForm();
      }
    } else {
      notyf.error("A valid email is required.");
    }
  });

  googleButton?.addEventListener("click", async () => {
    const response = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/login_callback`,
        skipBrowserRedirect: true,
      },
    });

    const redirect = response.data.url;
    if (redirect) {
      window.open(redirect, "_blank");
    }
  });

  appleButton?.addEventListener("click", async () => {
    const response = await supabase.auth.signInWithOAuth({
      provider: "apple",
      options: {
        redirectTo: `${window.location.origin}/login_callback`,
        skipBrowserRedirect: true,
      },
    });

    const redirect = response.data.url;
    if (redirect) {
      window.open(redirect, "_blank");
    }
  });

  signOutButton?.addEventListener("click", async () => {
    await supabase.auth.signOut();
  });

  submitFlights?.addEventListener("click", async () => {
    const textArea =
      document.querySelector<HTMLTextAreaElement>("#flights_content");
    let flights = textArea?.value;

    if (!flights) {
      notyf.error("Flights cannot be empty.");
      return;
    }

    flights = removeUselessText(flights);

    toggleSubmitButton(true);
    const { error } = await supabase.functions.invoke(
      "ryanair_verified_flights",
      {
        body: flights,
      }
    );

    if (error) {
      notyf.error(error.message);
    } else {
      notyf.success("Flights submitted successfully.");
    }

    toggleSubmitButton(false);
  });
};

document.addEventListener("DOMContentLoaded", addEventListeners);
