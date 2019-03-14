clc
clearvars
mortar_data

angles_deg = angles_deg .^2;

plot(angles_deg, ranges)

p = polyfit(angles_deg, ranges, 2);
py = polyval(p, angles_deg);

hold on;
plot(angles_deg, py);