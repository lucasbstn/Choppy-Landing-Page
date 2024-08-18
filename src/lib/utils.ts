export const removeUselessText = (flights: string) => {
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
		''
	);
};
