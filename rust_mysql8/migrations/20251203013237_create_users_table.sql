-- Add migration script here
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` timestamp DEFAULT NOW(),
  `email` varchar(255) NOT NULL,
  `firstname` varchar(255) DEFAULT NULL,
  `isactivated` int DEFAULT '1',
  `isblocked` int DEFAULT '0',
  `lastname` varchar(255) DEFAULT NULL,
  `mailtoken` int DEFAULT '0',
  `mobile` varchar(255) DEFAULT NULL,
  `password_digest` varchar(255) DEFAULT NULL,
  `qrcodeurl` text,
  `roles` varchar(255) NOT NULL DEFAULT 'ROLE_USER',
  `secret` text,
  `updated_at` timestamp DEFAULT NOW(),
  `username` varchar(255) NOT NULL,
  `userpic` varchar(255) NOT NULL DEFAULT 'pix.png',
  PRIMARY KEY (`id`),
  UNIQUE KEY `index_users_on_email` (`email`),
  UNIQUE KEY `index_users_on_username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb3;