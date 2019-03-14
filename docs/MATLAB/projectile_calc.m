clc
clearvars

% Const
v0 = 150;
ag = -15;

% Params
dx = 1000; % distance
dy = 50;    % elevation

% ---
a = ag * dx.^2 / v0.^2 / 2.0;
b = dx;
c = a - dy;

r = roots([a; b; c]);

deg = atand(r);

mil = deg ./ 45 * 800;