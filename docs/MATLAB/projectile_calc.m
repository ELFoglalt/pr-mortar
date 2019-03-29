clc
clearvars

% Const
v0 = 150; % Speed of the mortar round
ag = -15; % Effect of gravity

% Params
dx = 600; % distance
dy = 0;   % elevation

% ---
a = ag * dx.^2 / v0.^2 / 2.0;
b = dx;
c = a - dy;

r = roots([a; b; c]);

deg = atand(r);

mil = deg ./ 45 * 800 %#ok<NOPTS>