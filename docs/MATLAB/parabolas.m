v0_magn = 150;
vg_magn = -15;

X = @(a, t) v0_magn * cosd(a) .* t;
Y = @(a, t) 0.5 * vg_magn * t.^2 + v0_magn * sind(a) .* t;

t = 0:0.1:15;
a = 45;
posx = X(a, t);
posy = Y(a, t);

valid = posy >= 0;

plot(posx(valid), posy(valid));