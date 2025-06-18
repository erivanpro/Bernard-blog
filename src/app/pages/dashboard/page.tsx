"use client";

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import React, { useState } from "react";
import { useUser } from "@/app/context/UserContext";
import AjouterArticle from "./add/addanarticle";
import ArticlesTable from "./content/ArticlesTable";
import ArticlesDashboard from "./stats/stats";
import UserProfile from "./userprofile/userprofile";

const DashboardIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="20"
    height="17"
    viewBox="0 0 20 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      stroke={props.stroke || "currentColor"}
      fill={props.fill || "currentColor"}
      d="M2 0C0.895431 0 0 0.89543 0 2V15C0 16.1046 0.89543 17 2 17H18C19.1046 17 20 16.1046 20 15V5C20 3.89543 19.1046 3 18 3H10.5352L9.12892 0.8906C8.75799 0.334202 8.13352 0 7.46482 0H2Z"
    />
  </svg>
);

const PersonIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M11 20L13 13H22L20 20H11ZM11 20H6"
      stroke={props.stroke || "currentColor"}
      strokeWidth={2}
    />
    <circle
      cx="8.75"
      cy="7.5"
      r="3.5"
      stroke={props.stroke || "currentColor"}
      strokeWidth={2}
    />
    <path
      d="M2 21V21C2 17.134 5.13401 14 9 14V14"
      stroke={props.stroke || "currentColor"}
      strokeWidth={2}
    />
    <path
      d="M18.5 1.5L19.5804 4.41964L22.5 5.5L19.5804 6.58036L18.5 9.5L17.4196 6.58036L14.5 5.5L17.4196 4.41964L18.5 1.5Z"
      fill={props.fill || props.stroke || "currentColor"}
    />
  </svg>
);

const BlogIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle
      cx="11"
      cy="11"
      r="7"
      stroke={props.stroke || "currentColor"}
      strokeWidth={2}
      strokeLinecap="square"
      fill="none"
    />
    <path
      d="M20 20L16.05 16.05"
      stroke={props.stroke || "currentColor"}
      strokeWidth={2}
      strokeLinecap="square"
    />
  </svg>
);

const navigation = [
  { name: "Dashboard", icon: DashboardIcon },

  {
    name: "Blog",
    icon: BlogIcon,
    children: [{ name: "ajoutez un article", href: "#" },],
  },
  { name: "Profil", icon: PersonIcon },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Page() {
  const { user } = useUser();



  
  const [showAjouterArticle, setShowAjouterArticle] = useState(false);
  const [selectedView, setSelectedView] = useState<
    "dashboard" | "blog" | "profil"
  >("dashboard");

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar */}
      <div className="w-full md:w-1/4 lg:w-1/5 bg-white border-r border-gray-200">
        <div className="flex h-16 items-center px-6 bg-gradient-to-r bg-blue-600">
          <img
            alt="Your Company"
            src="https://web.archive.org/web/20250521091317im_/https://neodash.org/logowhite.png"
            className="h-8 w-auto"
          />
        </div>
        <nav className="px-6 py-4">
          <ul role="list" className="space-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => {
                  const isSelected = selectedView === item.name.toLowerCase();

                  if (!item.children) {
                    const IconComponent = item.icon;
                    return (
                      <li key={item.name}>
                        <button
                          onClick={() =>
                            setSelectedView(
                              item.name.toLowerCase() as "dashboard" | "blog"
                            )
                          }
                          className={classNames(
                            isSelected ? "bg-gray-100" : "hover:bg-gray-50",
                            "w-full text-left group flex gap-x-3 rounded-md p-2 text-sm font-semibold"
                          )}
                        >
                          <IconComponent
                            className={classNames(
                              "h-6 w-6 shrink-0",
                              isSelected ? "text-black" : "text-gray-400"
                            )}
                            aria-hidden="true"
                          />
                          <span
                            className={classNames(
                              isSelected ? "text-black" : "text-gray-700"
                            )}
                          >
                            {item.name}
                          </span>
                        </button>
                      </li>
                    );
                  }

                  // For items with children (like "Blog")
                  const IconComponent = item.icon;
                  return (
                    <li key={item.name}>
                      <Disclosure>
                        {({ open }) => (
                          <div>
                            <DisclosureButton
                              onClick={() =>
                                setSelectedView(
                                  item.name.toLowerCase() as
                                    | "dashboard"
                                    | "blog"
                                )
                              }
                              className={classNames(
                                isSelected ? "bg-gray-100" : "hover:bg-gray-50",
                                "group flex w-full items-center gap-x-3 rounded-md p-2 text-left text-sm font-semibold"
                              )}
                            >
                              <IconComponent
                                className={classNames(
                                  "h-6 w-6 shrink-0",
                                  isSelected ? "text-black" : "text-gray-400"
                                )}
                                stroke={isSelected ? "black" : "gray"}
                                fill={isSelected ? "black" : "none"}
                                aria-hidden="true"
                              />
                              <span
                                className={classNames(
                                  isSelected ? "text-black" : "text-gray-700"
                                )}
                              >
                                {item.name}
                              </span>
                              <ChevronRightIcon
                                className={classNames(
                                  "ml-auto h-5 w-5 shrink-0 text-gray-400 transition-transform duration-200",
                                  open ? "rotate-90" : ""
                                )}
                                aria-hidden="true"
                              />
                            </DisclosureButton>
                            <DisclosurePanel as="ul" className="mt-1 px-2">
                              {item.children.map((subItem) => (
                                <li key={subItem.name}>
                                  <DisclosureButton
                                    as="a"
                                    href={subItem.href}
                                    className="block rounded-md py-2 pr-2 pl-9 text-sm text-gray-700 hover:bg-gray-50"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setSelectedView("blog");
                                      if (
                                        subItem.name
                                          .toLowerCase()
                                          .includes("ajoutez")
                                      ) {
                                        setShowAjouterArticle(true);
                                      }
                                    }}
                                  >
                                    {subItem.name}
                                  </DisclosureButton>
                                </li>
                              ))}
                            </DisclosurePanel>
                          </div>
                        )}
                      </Disclosure>
                    </li>
                  );
                })}
              </ul>
            </li>

            <li className="-mx-6 mt-auto">
              <a
                href="#"
                className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50"
              >
                <img
                  src={
                    user?.profile_image ||
                    "https://via.placeholder.com/100x100?text=User"
                  }
                  alt={user ? `${user.firstname} ${user.lastname}` : "Guest"}
                  className="h-8 w-8 rounded-full bg-gray-50 object-cover"
                />
                <span className="sr-only">Your profile</span>
                <span
                  aria-hidden="true"
                  className="flex flex-col leading-tight"
                >
                  {user ? (
                    <>
                      <span>{`${user.firstname} ${user.lastname}`}</span>
                      {user.birthday && (
                        <span className="text-xs text-gray-500">
                          {user.birthday}
                        </span>
                      )}
                    </>
                  ) : ( 
                    "Guest"
                  )}
                </span>
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Middle Content */}
      <div className="w-full md:w-2/4 lg:w-3/5 p-4 bg-gray-50">
        {selectedView === "dashboard" && user?.id !== undefined && (
          <ArticlesDashboard userId={user.id} />
        )}
        {selectedView === "profil" && (
          <UserProfile
            onSave={(user) => {
              console.log("Profil sauvegardé :", user);
            }}
          />
        )}
        {selectedView === "blog" && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-xl font-bold text-gray-900">
                Gestion des articles
              </h1>
              <button
                onClick={() => setShowAjouterArticle((prev) => !prev)}
                className="px-3 py-1.5 rounded-[8px] text-white text-sm font-semibold shadow transition
                  bg-black"
              >
                {showAjouterArticle
                  ? "Fermer le formulaire"
                  : "Ajoutez un article"}
              </button>
            </div>

            {showAjouterArticle && <AjouterArticle />}
            <ArticlesTable />
          </>
        )}
      </div>

      {/* Right Sidebar */}
      <div className="w-full md:w-1/4 lg:w-1/5 p-4 bg-white border-l border-gray-200 flex flex-col justify-between">
        <div>
          {/* Home button as a gray square */}
          <div
            onClick={() => (window.location.href = "/")}
            className="cursor-pointer bg-gray-200 hover:bg-gray-300 transition rounded-lg h-12 flex items-center justify-center text-gray-700 font-semibold select-none mb-6"
          >
            Revenir
          </div>
        </div>

        <div className="mt-8 border-t pt-4 text-sm text-gray-500 space-y-1">
          <p>
            <a href="/terms" className="hover:underline">
              Conditions
            </a>
          </p>
          <p>
            <a href="/privacy" className="hover:underline">
              Confidentialité
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
